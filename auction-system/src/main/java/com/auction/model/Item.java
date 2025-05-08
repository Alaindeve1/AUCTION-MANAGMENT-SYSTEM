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
    @JoinColumn(name = "seller_id", nullable = true)
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

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }
    public ItemStatus getItemStatus() { return itemStatus; }
    public void setItemStatus(ItemStatus itemStatus) { this.itemStatus = itemStatus; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }
    public AuctionResult getAuctionResult() { return auctionResult; }
    public void setAuctionResult(AuctionResult auctionResult) { this.auctionResult = auctionResult; }
}