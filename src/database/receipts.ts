import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

export interface Receipt {
    id: number;
    project_id: number;
    category_id: number | null;
    name: string;
    amount: number;
    issued_at: string;
    created_at: string;
    updated_at: string;
}

export function useReceipts(projectId: number) {
    const db = useSQLiteContext();
    const [receipts, setReceipts] = useState<Receipt[]>([]);

    const fetchReceipts = async () => {
        try {
            const results = await db.getAllAsync<Receipt>(
                'SELECT * FROM receipts WHERE project_id = ? ORDER BY issued_at DESC',
                [projectId]
            );
            setReceipts(results);
        } catch (error) {
            console.error('Error fetching receipts:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchReceipts();
        }
    }, [projectId]);

    return { receipts, refreshReceipts: fetchReceipts };
}

export async function addReceipt(
    db: ReturnType<typeof useSQLiteContext>,
    projectId: number,
    categoryId: number | null,
    name: string,
    amount: number,
    issuedAt: string
) {
    try {
        await db.runAsync(
            `
      INSERT INTO receipts (project_id, category_id, name, amount, issued_at) 
      VALUES (?, ?, ?, ?, ?)
      `,
            [projectId, categoryId, name, amount, issuedAt]
        );
    } catch (error) {
        console.error('Error adding receipt:', error);
        throw error;
    }
}
