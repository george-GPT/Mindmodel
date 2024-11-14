import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SurveyAnalytics } from './survey';

export interface DashboardSection {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  title: string;
  progress: number;
  total: number;
  buttonText: string;
  route: string;
  tooltipText: string;
  color: 'primary' | 'secondary' | 'success';
  analytics?: SurveyAnalytics;
}

export interface AssessmentItem {
  id: string;
  title: string;
  route?: string;
} 