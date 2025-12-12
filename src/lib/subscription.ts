export function checkSubscriptionStatus(user: any) {
    if (!user) return user;

    const now = new Date();
    const updatedUser = { ...user };

    // Compute subscription statuses based on expiry dates
    updatedUser.isGold = updatedUser.goldExpiresAt ? new Date(updatedUser.goldExpiresAt) > now : false;
    updatedUser.isSilver = updatedUser.silverExpiresAt ? new Date(updatedUser.silverExpiresAt) > now : false;
    updatedUser.isFeatured = updatedUser.featuredExpiresAt ? new Date(updatedUser.featuredExpiresAt) > now : false;

    // Compute verification status
    updatedUser.verifiedPhotos = updatedUser.verifiedPhotosExpiry ? new Date(updatedUser.verifiedPhotosExpiry) > now : false;

    // Compute public/private status
    // If publicExpiry is in the future, it's public. Otherwise private.
    // const isPublic = updatedUser.publicExpiry ? new Date(updatedUser.publicExpiry) > now : false;
    // updatedUser.status = isPublic ? 'public' : 'private';

    return updatedUser;
}
