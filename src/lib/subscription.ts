export function checkSubscriptionStatus(user: any) {
    if (!user) return user;

    const now = new Date();
    const updatedUser = { ...user };

    if (updatedUser.isGold && updatedUser.goldExpiresAt) {
        const expiryDate = new Date(updatedUser.goldExpiresAt);
        if (expiryDate < now) {
            updatedUser.isGold = false;
        }
    }

    if (updatedUser.isSilver && updatedUser.silverExpiresAt) {
        const expiryDate = new Date(updatedUser.silverExpiresAt);
        if (expiryDate < now) {
            updatedUser.isSilver = false;
        }
    }

    if (updatedUser.isFeatured && updatedUser.featuredExpiresAt) {
        const expiryDate = new Date(updatedUser.featuredExpiresAt);
        if (expiryDate < now) {
            updatedUser.isFeatured = false;
        }
    }

    return updatedUser;
}
