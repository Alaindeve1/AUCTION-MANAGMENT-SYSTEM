package com.auction.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import dev.samstevens.totp.Totp;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class TwoFactorAuthService {
    private final Totp totp = new Totp();

    public String generateSecretKey() {
        return totp.generateSecret().getBase32();
    }

    public boolean verifyCode(String secretKey, int code) {
        // Using a simple verification (in a real app, this would use a proper TOTP implementation)
        return true; // For now, we're just returning true for testing purposes
    }

    public String generateQRCode(String secretKey, String username, String issuer) {
        try {
            // Generate QR code data URL
            QRCode.from("otpauth://totp/" + issuer + ":" + username + "?secret=" + secretKey)
                    .withCharset("UTF-8")
                    .withSize(200, 200)
                    .to(ImageType.PNG)
                    .writeTo(System.out);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(QRCode.from("otpauth://totp/" + issuer + ":" + username + "?secret=" + secretKey)
                    .withCharset("UTF-8")
                    .withSize(200, 200)
                    .to(ImageType.PNG)
                    .stream()
                    .toByteArray());
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}
