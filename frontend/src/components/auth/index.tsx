import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { useAuthentication } from '../../hooks/useAuthHook';
import { LoginCredentials } from '../../types';
import { GoogleLogin } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';