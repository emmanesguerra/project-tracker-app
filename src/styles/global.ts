import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#007bff',
    background: '#f2f5e9f5',
    textDark: '#333',
    textLight: '#888',
    white: '#fff',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 20,
    },
    projectItem: {
        flexDirection: 'column',
        marginBottom: 12,
        padding: 12,
        borderLeftWidth: 6,
        borderLeftColor: colors.primary,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    projectIcon: {
        marginRight: 8,
    },
    projectName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    projectDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 2,
    },
    projectBudget: {
        fontSize: 14,
        color: '#333',
    },
    projectDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 6,
    },
    box: {
        backgroundColor: '#e0f0ff',
        padding: 12,
        borderRadius: 5,
        position: 'relative',
        marginTop: 10,
        borderLeftWidth: 6,
        borderLeftColor: colors.primary,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    small: {
        fontSize: 12,
    },
    viewGalleryButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#b17339ff',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    viewGalleryText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.textDark,
    },
    editButtonContainer: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    editButton: {
        paddingVertical: 3,
        paddingHorizontal: 3,
        borderRadius: 2,
    },
    receiptHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 20,
    },
    receiptTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    addButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    receiptCard: {
        flexDirection: 'row',
        borderLeftWidth: 6,
        borderLeftColor: '#e9e170ff',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    receiptCardLeft: {
        width: '60%',
    },
    receiptCardRight: {
        borderLeftWidth: 2,
        borderLeftColor: '#dfdfdfff',
        width: '40%',
        paddingLeft: '5%',
    },
    receiptName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    receiptAmount: {
        fontSize: 16,
    },
    receiptCategory: {
        fontSize: 16,
    },
    receiptDate: {
        fontSize: 14,
        color: 'gray',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 8,
    },
    imageScroll: {
        marginTop: 8,
    },
    emptyText: {
        color: 'gray',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
