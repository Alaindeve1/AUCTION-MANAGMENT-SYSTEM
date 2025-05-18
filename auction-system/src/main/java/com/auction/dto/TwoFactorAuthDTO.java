package com.auction.dto;

public class TwoFactorAuthDTO {
    private String secret;
    private String qrCode;

    public TwoFactorAuthDTO() {}

    public TwoFactorAuthDTO(String secret, String qrCode) {
        this.secret = secret;
        this.qrCode = qrCode;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
}
