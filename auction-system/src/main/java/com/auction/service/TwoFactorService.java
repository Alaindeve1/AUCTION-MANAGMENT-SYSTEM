package com.auction.service;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

import static dev.samstevens.totp.util.Utils.getDataUriForImage;

@Service
public class TwoFactorService {
    private final SecretGenerator secretGenerator;
    private final QrGenerator qrGenerator;
    private final TimeProvider timeProvider;
    private final CodeGenerator codeGenerator;
    private final CodeVerifier codeVerifier;

    public TwoFactorService() {
        this.secretGenerator = new DefaultSecretGenerator();
        this.qrGenerator = new ZxingPngQrGenerator();
        this.timeProvider = new SystemTimeProvider();
        this.codeGenerator = new DefaultCodeGenerator();
        this.codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    }

    public String generateNewSecret() {
        return secretGenerator.generate();
    }

    public String generateQrCodeImageUri(String secret, String email) {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer("AuctionHub")
                .build();

        try {
            byte[] imageData = qrGenerator.generate(data);
            return getDataUriForImage(imageData, qrGenerator.getImageMimeType());
        } catch (QrGenerationException e) {
            throw new RuntimeException("Error generating QR code", e);
        }
    }

    public boolean verifyCode(String secret, String code) {
        return codeVerifier.isValidCode(secret, code);
    }
} 