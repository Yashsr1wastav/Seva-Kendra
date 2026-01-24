export const stripUserData = (userDocument) => {
    const {
        _id,
        firstName,
        lastName,
        email,
        role,
        status,
        permissions,
        lastLogin,
        createdAt,
        updatedAt
    } = userDocument;
    
    return {
        _id: _id.toString(),
        id: _id.toString(),
        firstName,
        lastName,
        email,
        role,
        status,
        permissions: permissions || [],
        lastLogin,
        createdAt,
        updatedAt,
    };
}