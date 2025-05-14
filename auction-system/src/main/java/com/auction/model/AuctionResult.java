package com.auction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.math.BigDecimal;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "auction_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "resultId"
)
@ToString(exclude = {"item", "winner"})
public class AuctionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", unique = true, nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    @NotNull
    private BigDecimal finalPrice;

    @Enumerated(EnumType.STRING)
    private ResultStatus resultStatus;

    @PrePersist
    protected void onCreate() {
        if (resultStatus == null) {
            resultStatus = ResultStatus.PENDING;
        }
        validateFinalPrice();
    }

    @PreUpdate
    protected void onUpdate() {
        validateFinalPrice();
    }

    private void validateFinalPrice() {
        if (resultStatus == ResultStatus.CANCELLED) {
            if (finalPrice == null) {
                finalPrice = BigDecimal.ZERO;
            }
        } else if (finalPrice == null || finalPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Final price must be greater than 0 for non-cancelled auctions");
        }
    }

    public enum ResultStatus {
        PENDING, COMPLETED, CANCELLED
    }

    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public User getWinner() { return winner; }
    public void setWinner(User winner) { this.winner = winner; }
    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
    public ResultStatus getResultStatus() { return resultStatus; }
    public void setResultStatus(ResultStatus resultStatus) { this.resultStatus = resultStatus; }
}