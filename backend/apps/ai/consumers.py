import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from .tasks import perform_ai_analysis

class AnalysisConsumer(AsyncWebsocketConsumer):
    TIMEOUT = 300  # 5 minutes timeout
    
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.room_group_name = f'analysis_{self.task_id}'
        self.disconnect_timer = None

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Start timeout timer
        self.disconnect_timer = asyncio.create_task(self.disconnect_on_timeout())
        
        await self.accept()

    async def disconnect_on_timeout(self):
        """Disconnect after timeout period"""
        await asyncio.sleep(self.TIMEOUT)
        await self.close()

    async def disconnect(self, close_code):
        # Cancel timeout timer
        if self.disconnect_timer:
            self.disconnect_timer.cancel()
            
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Clean up any resources
        await self.cleanup()

    async def cleanup(self):
        """Clean up any resources when disconnecting"""
        try:
            # Cancel any pending tasks
            if hasattr(self, 'current_task'):
                self.current_task.revoke(terminate=True)
            
            # Clear cache if needed
            cache_key = f"analysis_data_{self.task_id}"
            await database_sync_to_async(cache.delete)(cache_key)
            
        except Exception as e:
            print(f"Cleanup error: {str(e)}")

    async def receive(self, text_data):
        """Handle incoming WebSocket messages with timeout"""
        try:
            data = json.loads(text_data)
            # Reset timeout timer
            if self.disconnect_timer:
                self.disconnect_timer.cancel()
            self.disconnect_timer = asyncio.create_task(self.disconnect_on_timeout())
            
            await self.send(text_data=json.dumps({
                'status': 'received'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': str(e)
            }))

    async def analysis_update(self, event):
        """
        Receive analysis update from room group
        """
        await self.send(text_data=json.dumps(event['data']))

    async def send_status_update(self, task):
        """
        Send task status update to WebSocket
        """
        if task.ready():
            if task.successful():
                data = {
                    'type': 'analysis_complete',
                    'status': 'completed',
                    'result_id': task.result
                }
            else:
                data = {
                    'type': 'analysis_error',
                    'status': 'failed',
                    'error': str(task.result)
                }
        else:
            data = {
                'type': 'analysis_progress',
                'status': 'processing'
            }

        await self.send(text_data=json.dumps(data)) 