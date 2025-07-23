import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'



export async function DELETE(){ 
    const now = new Date(); 
    try{ 
        const result = await prisma.shortUrl.deleteMany({ 
            where: { 
                expiresAt: { 
                    lt: now, 
                }   
            }
        }); 
     
        return NextResponse.json({ 
            message: `Deleted ${result.count} expired links`, 
        }); 
    }catch (err: unknown) {
    const error = err as { code?: string }

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Short ID already exists' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}