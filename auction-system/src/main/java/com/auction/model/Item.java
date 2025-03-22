package com.auction.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "itemId"
)
@ToString(exclude = {"seller", "bids", "auctionResult"})
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @NotNull
    @Positive
    private BigDecimal startingPrice;

    @Enumerated(EnumType.STRING)
    private ItemStatus itemStatus;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<Bid> bids = new ArrayList<>();

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL)
    private AuctionResult auctionResult;

    @Column(name = "last_item_bid_id") 
    private Long lastItemBidId = 0L;

    @PrePersist
    protected void onCreate() {
        if (itemStatus == null) {
            itemStatus = ItemStatus.DRAFT;
        }
        if (lastItemBidId == null) {
            lastItemBidId = 0L;
        }
    }

    public Long getLastItemBidId() {
        return lastItemBidId;
    }

    public void setLastItemBidId(Long lastItemBidId) {
        this.lastItemBidId = lastItemBidId;
    }

    public enum ItemStatus {
        DRAFT, ACTIVE, ENDED, SOLD
    }
}