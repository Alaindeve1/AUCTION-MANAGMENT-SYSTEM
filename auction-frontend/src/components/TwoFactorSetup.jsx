import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, CircularProgress } from '@mui/material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const TwoFactorSetup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [code, setCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const navigate = useNavigate();

    const setup2FA = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await api.post('/api/auth/2fa/setup', { username: user.username });
            setQrCode(response.data.qrCode);
            setSecretKey(response.data.secretKey);
            setShowVerification(true);
        } catch (err) {
            setError('Failed to setup 2FA');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        try {
            setLoading(true);
            const isValid = await api.post('/api/auth/2fa/verify', {
                secretKey,
                code: parseInt(code)
            });
            
            if (isValid.data) {
                // Store secret key securely
                localStorage.setItem('2faSecret', secretKey);
                navigate('/dashboard');
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            setError('Failed to verify code');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (e) => {
        const value = e.target.value;
        // Only allow numbers
        if (!value || /^[0-9]*$/.test(value)) {
            setCode(value);
            setError('');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Two-Factor Authentication
                </Typography>
                
                {!showVerification ? (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Setting up 2FA will enhance your account security.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={setup2FA}
                            disabled={loading}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Setup 2FA'}
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Scan the QR code with your authenticator app:
                        </Typography>
                        {qrCode && (
                            <img src={qrCode} alt="2FA QR Code" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                        )}
                        <TextField
                            label="Enter verification code"
                            type="number"
                            value={code}
                            onChange={handleCodeChange}
                            error={!!error}
                            helperText={error}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={verifyCode}
                            disabled={loading || !code}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default TwoFactorSetup;
