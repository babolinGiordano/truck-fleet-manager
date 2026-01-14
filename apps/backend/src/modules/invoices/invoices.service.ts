import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const invoices = await this.prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        items: true,
      },
    });

    return invoices.map(this.mapInvoiceToResponse);
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Fattura con ID ${id} non trovata`);
    }

    return this.mapInvoiceToResponse(invoice);
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: createInvoiceDto.invoiceNumber,
        clientId: createInvoiceDto.clientId,
        issueDate: new Date(createInvoiceDto.issueDate),
        dueDate: new Date(createInvoiceDto.dueDate),
        status: createInvoiceDto.status,
        subtotal: createInvoiceDto.subtotal,
        vatRate: createInvoiceDto.vatRate || 22,
        vatAmount: createInvoiceDto.vatAmount,
        total: createInvoiceDto.total,
        notes: createInvoiceDto.notes,
        paidDate: createInvoiceDto.paidDate
          ? new Date(createInvoiceDto.paidDate)
          : undefined,
        items: {
          create: createInvoiceDto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            tripId: item.tripId,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return this.mapInvoiceToResponse(invoice);
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    await this.findOne(id);

    // If items are being updated, delete existing and create new
    if (updateInvoiceDto.items) {
      await this.prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });
    }

    const data: any = {};
    if (updateInvoiceDto.invoiceNumber !== undefined)
      data.invoiceNumber = updateInvoiceDto.invoiceNumber;
    if (updateInvoiceDto.clientId !== undefined)
      data.clientId = updateInvoiceDto.clientId;
    if (updateInvoiceDto.issueDate !== undefined)
      data.issueDate = new Date(updateInvoiceDto.issueDate);
    if (updateInvoiceDto.dueDate !== undefined)
      data.dueDate = new Date(updateInvoiceDto.dueDate);
    if (updateInvoiceDto.status !== undefined)
      data.status = updateInvoiceDto.status;
    if (updateInvoiceDto.subtotal !== undefined)
      data.subtotal = updateInvoiceDto.subtotal;
    if (updateInvoiceDto.vatRate !== undefined)
      data.vatRate = updateInvoiceDto.vatRate;
    if (updateInvoiceDto.vatAmount !== undefined)
      data.vatAmount = updateInvoiceDto.vatAmount;
    if (updateInvoiceDto.total !== undefined)
      data.total = updateInvoiceDto.total;
    if (updateInvoiceDto.notes !== undefined)
      data.notes = updateInvoiceDto.notes;
    if (updateInvoiceDto.paidDate !== undefined)
      data.paidDate = new Date(updateInvoiceDto.paidDate);

    if (updateInvoiceDto.items) {
      data.items = {
        create: updateInvoiceDto.items.map((item) => ({
          description: item.description,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          tripId: item.tripId,
        })),
      };
    }

    const invoice = await this.prisma.invoice.update({
      where: { id },
      data,
      include: {
        client: true,
        items: true,
      },
    });

    return this.mapInvoiceToResponse(invoice);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  private mapInvoiceToResponse(invoice: any) {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      issueDate: invoice.issueDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      status: invoice.status,
      items: invoice.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        tripId: item.tripId,
      })),
      subtotal: Number(invoice.subtotal),
      vatRate: Number(invoice.vatRate),
      vatAmount: Number(invoice.vatAmount),
      total: Number(invoice.total),
      notes: invoice.notes,
      paidDate: invoice.paidDate?.toISOString().split('T')[0],
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      client: invoice.client,
    };
  }
}
