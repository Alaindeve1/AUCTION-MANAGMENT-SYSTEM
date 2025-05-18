package com.auction.controller;

import com.auction.dto.TwoFactorAuthDTO;
import com.auction.service.TwoFactorAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/2fa")
public class TwoFactorAuthController {
    private final TwoFactorAuthService twoFactorAuthService;

    public TwoFactorAuthController(TwoFactorAuthService twoFactorAuthService) {
        this.twoFactorAuthService = twoFactorAuthService;
    }

    @PostMapping("/setup")
    public ResponseEntity<TwoFactorAuthDTO> setupTwoFactorAuth(@RequestParam String username) {
        String secretKey = twoFactorAuthService.generateSecretKey();
        String qrCode = twoFactorAuthService.generateQRCode(secretKey, username, "AuctionSystem");
        
        return ResponseEntity.ok(new TwoFactorAuthDTO(
            secretKey,
            qrCode
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyTwoFactorCode(
            @RequestParam String secretKey,
            @RequestParam int code) {
        boolean isValid = twoFactorAuthService.verifyCode(secretKey, code);
        return ResponseEntity.ok(isValid);
    }
}
