import { Box, Container, Paper } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-soft p-8 transform transition-all duration-300 hover:scale-[1.02]">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 