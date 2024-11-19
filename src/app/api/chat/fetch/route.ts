import { NextResponse, NextRequest } from "next/server";
import { query } from '../../../../../lib/db';


export async function POST(request: NextRequest) {
  const {senderId, reciverId} = await request.json();
  const selectQuery = `
    SELECT * FROM Message
    WHERE (senderid = $1 AND receiverid = $2) OR (senderid = $2 AND receiverid = $1)
    ORDER BY time ASC
  `;

  const result = await query(selectQuery, [senderId, reciverId]);

  let messages_array_sorted_by_time = result.rows;
  messages_array_sorted_by_time.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return NextResponse.json(messages_array_sorted_by_time);
}