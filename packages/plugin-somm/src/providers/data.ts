import { PostgresDatabaseAdapter } from "@ai16z/adapter-postgres";
import {
    AgentRuntime as IAgentRuntime,
} from "@ai16z/eliza";
import type { Memory, Provider, State } from "@ai16z/eliza";

const db = new PostgresDatabaseAdapter({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

const dataProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        type Tx = {
            amount: number;
            sender: string;
            receiver: string;
            blockNumber: number;
        }

        try {
            const depositsQuery = `
                SELECT amount, sender, receiver, block_number
                FROM transactions
                WHERE transaction_type = 'deposit'
                ORDER BY block_number DESC
                LIMIT 10
            `;

            const withdrawalsQuery = `
                SELECT amount, sender, receiver, block_number
                FROM transactions
                WHERE transaction_type = 'withdrawal'
                ORDER BY block_number DESC
                LIMIT 10
            `;

            const depositsResult = await db.query(depositsQuery);
            const withdrawalsResult = await db.query(withdrawalsQuery);

            const deposits: Tx[] = depositsResult.rows.map(row => ({
                amount: row.amount,
                sender: row.sender,
                receiver: row.receiver,
                blockNumber: row.block_number
            }));

            const withdrawals: Tx[] = withdrawalsResult.rows.map(row => ({
                amount: row.amount,
                sender: row.sender,
                receiver: row.receiver,
                blockNumber: row.block_number
            }));

            return `Last 10 deposits: ${JSON.stringify(deposits)}.
                    \nLast 10 withdrawals: ${JSON.stringify(withdrawals)}`;
        } catch (error) {
            return '';
        }
    },
};

export { dataProvider };
