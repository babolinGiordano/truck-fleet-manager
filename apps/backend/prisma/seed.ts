import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ID mappings from old IDs to new IDs
const vehicleIdMap: Record<string, string> = {};
const driverIdMap: Record<string, string> = {};
const clientIdMap: Record<string, string> = {};
const tripIdMap: Record<string, string> = {};

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.fuelRecord.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.client.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  // Seed Vehicles
  console.log('🚚 Seeding vehicles...');
  const vehicles = [
    {
      oldId: 'v1',
      plate: 'FH123AB',
      brand: 'Iveco',
      model: 'Stralis',
      year: 2021,
      status: 'available' as const,
      lastLat: 43.7696,
      lastLng: 11.2558,
      lastPositionAt: new Date('2024-11-24T10:30:00Z'),
      kmTotal: 245000,
      insuranceExpiry: new Date('2025-06-15'),
      revisionExpiry: new Date('2025-03-20'),
      notes: '',
    },
    {
      oldId: 'v2',
      plate: 'DE456FG',
      brand: 'MAN',
      model: 'TGX',
      year: 2020,
      status: 'in_transit' as const,
      lastLat: 41.9028,
      lastLng: 12.4964,
      lastPositionAt: new Date('2024-11-24T10:25:00Z'),
      kmTotal: 312000,
      insuranceExpiry: new Date('2025-04-10'),
      revisionExpiry: new Date('2025-01-15'),
    },
    {
      oldId: 'v3',
      plate: 'GH789CD',
      brand: 'Scania',
      model: 'R500',
      year: 2022,
      status: 'available' as const,
      kmTotal: 156000,
      insuranceExpiry: new Date('2025-08-22'),
      revisionExpiry: new Date('2025-05-10'),
    },
    {
      oldId: 'v4',
      plate: 'LM012NO',
      brand: 'Volvo',
      model: 'FH16',
      year: 2019,
      status: 'maintenance' as const,
      kmTotal: 420000,
      insuranceExpiry: new Date('2025-02-28'),
      revisionExpiry: new Date('2024-12-05'),
      notes: 'In officina per tagliando',
    },
    {
      oldId: 'v5',
      plate: 'PQ345RS',
      brand: 'Mercedes',
      model: 'Actros',
      year: 2023,
      status: 'in_transit' as const,
      lastLat: 45.4642,
      lastLng: 9.19,
      lastPositionAt: new Date('2024-11-24T10:28:00Z'),
      kmTotal: 78000,
      insuranceExpiry: new Date('2025-11-30'),
      revisionExpiry: new Date('2025-09-15'),
    },
  ];

  for (const v of vehicles) {
    const { oldId, ...data } = v;
    const created = await prisma.vehicle.create({ data });
    vehicleIdMap[oldId] = created.id;
  }

  // Seed Drivers
  console.log('👤 Seeding drivers...');
  const drivers = [
    {
      oldId: 'd1',
      firstName: 'Marco',
      lastName: 'Bianchi',
      fiscalCode: 'BNCMRC80A01H501Z',
      phone: '+39 333 1234567',
      email: 'marco.bianchi@email.com',
      licenseNumber: 'MI12345678',
      licenseExpiry: new Date('2024-12-01'),
      cqcExpiry: new Date('2025-06-15'),
      status: 'active' as const,
      assignedVehicleId: 'v1',
      hireDate: new Date('2018-03-15'),
    },
    {
      oldId: 'd2',
      firstName: 'Giuseppe',
      lastName: 'Rossi',
      fiscalCode: 'RSSGPP75B15F205X',
      phone: '+39 334 2345678',
      email: 'giuseppe.rossi@email.com',
      licenseNumber: 'RM23456789',
      licenseExpiry: new Date('2026-04-10'),
      cqcExpiry: new Date('2025-09-20'),
      status: 'active' as const,
      assignedVehicleId: 'v2',
      hireDate: new Date('2019-06-01'),
    },
    {
      oldId: 'd3',
      firstName: 'Antonio',
      lastName: 'Verdi',
      fiscalCode: 'VRDNTN82C20L219Y',
      phone: '+39 335 3456789',
      email: 'antonio.verdi@email.com',
      licenseNumber: 'TO34567890',
      licenseExpiry: new Date('2027-01-25'),
      cqcExpiry: new Date('2026-02-10'),
      status: 'active' as const,
      assignedVehicleId: 'v5',
      hireDate: new Date('2020-01-15'),
    },
  ];

  for (const d of drivers) {
    const { oldId, assignedVehicleId, ...data } = d;
    const created = await prisma.driver.create({
      data: {
        ...data,
        assignedVehicleId: assignedVehicleId ? vehicleIdMap[assignedVehicleId] : undefined,
      },
    });
    driverIdMap[oldId] = created.id;
  }

  // Update vehicles with currentDriverId
  await prisma.vehicle.update({
    where: { id: vehicleIdMap['v1'] },
    data: { currentDriverId: driverIdMap['d1'] },
  });
  await prisma.vehicle.update({
    where: { id: vehicleIdMap['v2'] },
    data: { currentDriverId: driverIdMap['d2'] },
  });
  await prisma.vehicle.update({
    where: { id: vehicleIdMap['v5'] },
    data: { currentDriverId: driverIdMap['d3'] },
  });

  // Seed Clients
  console.log('🏢 Seeding clients...');
  const clients = [
    {
      oldId: 'c1',
      companyName: 'TechCorp SRL',
      vatNumber: 'IT12345678901',
      address: "Via dell'Industria 45",
      city: 'Milano',
      province: 'MI',
      postalCode: '20100',
      country: 'Italia',
      phone: '+39 02 1234567',
      email: 'info@techcorp.it',
      pec: 'techcorp@pec.it',
      sdiCode: 'ABCD123',
      contactPerson: 'Laura Martini',
      isActive: true,
    },
    {
      oldId: 'c2',
      companyName: 'LogiTrans SRL',
      vatNumber: 'IT98765432109',
      address: 'Via Roma 123',
      city: 'Torino',
      province: 'TO',
      postalCode: '10100',
      country: 'Italia',
      phone: '+39 011 7654321',
      email: 'logistica@logitrans.it',
      pec: 'logitrans@pec.it',
      sdiCode: 'EFGH456',
      contactPerson: 'Roberto Conti',
      isActive: true,
    },
    {
      oldId: 'c3',
      companyName: 'FastDelivery SpA',
      vatNumber: 'IT11223344556',
      address: 'Viale Europa 78',
      city: 'Bologna',
      province: 'BO',
      postalCode: '40100',
      country: 'Italia',
      phone: '+39 051 9876543',
      email: 'ordini@fastdelivery.it',
      pec: 'fastdelivery@pec.it',
      sdiCode: 'IJKL789',
      contactPerson: 'Sara Ricci',
      isActive: true,
    },
  ];

  for (const c of clients) {
    const { oldId, ...data } = c;
    const created = await prisma.client.create({ data });
    clientIdMap[oldId] = created.id;
  }

  // Seed Trips
  console.log('🛣️  Seeding trips...');
  const trips = [
    {
      oldId: 't1',
      tripNumber: 'VG-2024-001',
      vehicleId: 'v1',
      driverId: 'd1',
      clientId: 'c1',
      originCompany: 'TechCorp SRL',
      originAddress: "Via dell'Industria 45",
      originCity: 'Milano',
      originProvince: 'MI',
      originPostalCode: '20100',
      originCountry: 'Italia',
      originLat: 45.4642,
      originLng: 9.19,
      destCompany: 'Deposito Roma Est',
      destAddress: 'Via Tiburtina 500',
      destCity: 'Roma',
      destProvince: 'RM',
      destPostalCode: '00159',
      destCountry: 'Italia',
      destLat: 41.9028,
      destLng: 12.4964,
      cargoDescription: 'Componenti elettronici',
      cargoWeight: 8500,
      cargoPackages: 45,
      cargoIsADR: false,
      status: 'completed' as const,
      plannedDeparture: new Date('2024-11-23T06:00:00Z'),
      actualDeparture: new Date('2024-11-23T06:15:00Z'),
      plannedArrival: new Date('2024-11-23T14:00:00Z'),
      actualArrival: new Date('2024-11-23T13:45:00Z'),
      kmPlanned: 574,
      kmActual: 580,
      price: 850,
    },
    {
      oldId: 't2',
      tripNumber: 'VG-2024-002',
      vehicleId: 'v2',
      driverId: 'd2',
      clientId: 'c2',
      originCompany: 'LogiTrans SRL',
      originAddress: 'Via Roma 123',
      originCity: 'Torino',
      originProvince: 'TO',
      originPostalCode: '10100',
      originCountry: 'Italia',
      destCompany: 'Centro Distribuzione Sud',
      destAddress: 'Via Toledo 100',
      destCity: 'Napoli',
      destProvince: 'NA',
      destPostalCode: '80100',
      destCountry: 'Italia',
      cargoDescription: 'Macchinari industriali',
      cargoWeight: 12000,
      cargoPackages: 8,
      cargoIsADR: false,
      status: 'completed' as const,
      plannedDeparture: new Date('2024-11-24T04:00:00Z'),
      actualDeparture: new Date('2024-11-24T05:10:00Z'),
      plannedArrival: new Date('2024-11-24T15:00:00Z'),
      kmPlanned: 912,
      price: 1200,
    },
    {
      oldId: 't3',
      tripNumber: 'VG-2024-003',
      vehicleId: 'v3',
      driverId: 'd3',
      clientId: 'c3',
      originCompany: 'FastDelivery SpA',
      originAddress: 'Viale Europa 78',
      originCity: 'Bologna',
      originProvince: 'BO',
      originPostalCode: '40100',
      originCountry: 'Italia',
      originLat: 44.4949,
      originLng: 11.3426,
      destCompany: 'Supermercati Puglia',
      destAddress: 'Via Sparano 100',
      destCity: 'Bari',
      destProvince: 'BA',
      destPostalCode: '70100',
      destCountry: 'Italia',
      destLat: 41.1171,
      destLng: 16.8719,
      cargoDescription: 'Prodotti alimentari',
      cargoWeight: 15000,
      cargoPackages: 120,
      cargoIsADR: false,
      cargoTemperature: 4,
      status: 'planned' as const,
      plannedDeparture: new Date('2024-11-25T04:00:00Z'),
      plannedArrival: new Date('2024-11-25T12:00:00Z'),
      kmPlanned: 680,
      price: 680,
    },
  ];

  for (const t of trips) {
    const { oldId, vehicleId, driverId, clientId, ...data } = t;
    const created = await prisma.trip.create({
      data: {
        ...data,
        vehicleId: vehicleIdMap[vehicleId],
        driverId: driverIdMap[driverId],
        clientId: clientIdMap[clientId],
      },
    });
    tripIdMap[oldId] = created.id;
  }

  // Seed Invoices
  console.log('📄 Seeding invoices...');
  const invoices = [
    {
      invoiceNumber: 'FT-2024-001',
      clientId: 'c1',
      issueDate: new Date('2024-11-25'),
      dueDate: new Date('2024-12-25'),
      status: 'paid' as const,
      subtotal: 850,
      vatRate: 22,
      vatAmount: 187,
      total: 1037,
      paidDate: new Date('2024-12-10'),
      items: [
        {
          description: 'Trasporto Milano - Roma (VG-2024-001)',
          quantity: 1,
          unitPrice: 850,
          totalPrice: 850,
          tripId: 't1',
        },
      ],
    },
    {
      invoiceNumber: 'FT-2024-002',
      clientId: 'c2',
      issueDate: new Date('2024-11-26'),
      dueDate: new Date('2024-12-26'),
      status: 'sent' as const,
      subtotal: 1200,
      vatRate: 22,
      vatAmount: 264,
      total: 1464,
      items: [
        {
          description: 'Trasporto Torino - Napoli (VG-2024-002)',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
          tripId: 't2',
        },
      ],
    },
    {
      invoiceNumber: 'FT-2024-003',
      clientId: 'c3',
      issueDate: new Date('2024-10-15'),
      dueDate: new Date('2024-11-15'),
      status: 'overdue' as const,
      subtotal: 830,
      vatRate: 22,
      vatAmount: 182.6,
      total: 1012.6,
      notes: 'Sollecito inviato il 20/11/2024',
      items: [
        {
          description: 'Trasporto Bologna - Bari',
          quantity: 1,
          unitPrice: 680,
          totalPrice: 680,
          tripId: undefined,
        },
        {
          description: 'Supplemento frigorifero',
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
          tripId: undefined,
        },
      ],
    },
    {
      invoiceNumber: 'FT-2024-004',
      clientId: 'c1',
      issueDate: new Date('2024-12-01'),
      dueDate: new Date('2025-01-01'),
      status: 'draft' as const,
      subtotal: 900,
      vatRate: 22,
      vatAmount: 198,
      total: 1098,
      items: [
        {
          description: 'Trasporto componenti elettronici',
          quantity: 2,
          unitPrice: 450,
          totalPrice: 900,
          tripId: undefined,
        },
      ],
    },
    {
      invoiceNumber: 'FT-2024-005',
      clientId: 'c2',
      issueDate: new Date('2024-09-20'),
      dueDate: new Date('2024-10-20'),
      status: 'paid' as const,
      subtotal: 1700,
      vatRate: 22,
      vatAmount: 374,
      total: 2074,
      paidDate: new Date('2024-10-18'),
      items: [
        {
          description: 'Trasporto macchinari industriali',
          quantity: 1,
          unitPrice: 1500,
          totalPrice: 1500,
          tripId: undefined,
        },
        {
          description: 'Servizio carico/scarico',
          quantity: 1,
          unitPrice: 200,
          totalPrice: 200,
          tripId: undefined,
        },
      ],
    },
  ];

  for (const inv of invoices) {
    const { clientId, items, ...data } = inv;
    await prisma.invoice.create({
      data: {
        ...data,
        clientId: clientIdMap[clientId],
        items: {
          create: items.map((item) => ({
            ...item,
            tripId: item.tripId ? tripIdMap[item.tripId] : undefined,
          })),
        },
      },
    });
  }

  // Seed Fuel Records
  console.log('⛽ Seeding fuel records...');
  const fuelRecords = [
    { vehicleId: 'v1', driverId: 'd1', date: new Date('2024-12-10'), liters: 450, pricePerLiter: 1.589, totalCost: 715.05, fuelType: 'diesel' as const, stationName: 'ENI - Milano Est', odometer: 244500, fullTank: true },
    { vehicleId: 'v2', driverId: 'd2', date: new Date('2024-12-09'), liters: 520, pricePerLiter: 1.612, totalCost: 838.24, fuelType: 'diesel' as const, stationName: 'Q8 - Roma Tiburtina', odometer: 311200, fullTank: true },
    { vehicleId: 'v3', driverId: 'd3', date: new Date('2024-12-08'), liters: 380, pricePerLiter: 1.575, totalCost: 598.5, fuelType: 'diesel' as const, stationName: 'IP - Bologna Fiera', odometer: 155600, fullTank: true },
    { vehicleId: 'v5', driverId: 'd3', date: new Date('2024-12-07'), liters: 280, pricePerLiter: 1.599, totalCost: 447.72, fuelType: 'diesel' as const, stationName: 'Tamoil - Torino Sud', odometer: 77500, fullTank: false, notes: 'Rifornimento parziale' },
    { vehicleId: 'v1', driverId: 'd1', date: new Date('2024-12-05'), liters: 420, pricePerLiter: 1.605, totalCost: 674.1, fuelType: 'diesel' as const, stationName: 'Agip - Firenze Nord', odometer: 243800, fullTank: true },
    { vehicleId: 'v2', driverId: 'd2', date: new Date('2024-12-03'), liters: 490, pricePerLiter: 1.595, totalCost: 781.55, fuelType: 'diesel' as const, stationName: 'Shell - Napoli Centro', odometer: 310100, fullTank: true },
    { vehicleId: 'v4', driverId: 'd1', date: new Date('2024-11-28'), liters: 550, pricePerLiter: 1.582, totalCost: 870.1, fuelType: 'diesel' as const, stationName: 'Total - Verona Est', odometer: 419000, fullTank: true },
    { vehicleId: 'v3', driverId: 'd3', date: new Date('2024-11-25'), liters: 400, pricePerLiter: 1.569, totalCost: 627.6, fuelType: 'diesel' as const, stationName: 'Esso - Padova Ovest', odometer: 154800, fullTank: true },
    { vehicleId: 'v5', driverId: 'd3', date: new Date('2024-11-22'), liters: 320, pricePerLiter: 1.558, totalCost: 498.56, fuelType: 'diesel' as const, stationName: 'Repsol - Genova Porto', odometer: 76800, fullTank: true },
    { vehicleId: 'v1', driverId: 'd1', date: new Date('2024-11-20'), liters: 460, pricePerLiter: 1.545, totalCost: 710.7, fuelType: 'diesel' as const, stationName: 'ENI - Brescia Centro', odometer: 242900, fullTank: true },
  ];

  for (const f of fuelRecords) {
    const { vehicleId, driverId, ...data } = f;
    await prisma.fuelRecord.create({
      data: {
        ...data,
        vehicleId: vehicleIdMap[vehicleId],
        driverId: driverId ? driverIdMap[driverId] : undefined,
      },
    });
  }

  // Seed Maintenance Records
  console.log('🔧 Seeding maintenance records...');
  const maintenanceRecords = [
    { vehicleId: 'v1', type: 'oil_change' as const, description: 'Cambio olio motore e filtro olio', date: new Date('2024-12-10'), odometer: 244800, cost: 320, workshop: 'Officina Bianchi SRL', invoiceNumber: 'FT-2024-0891', nextMaintenanceDate: new Date('2025-06-10'), nextMaintenanceKm: 260000, status: 'completed' as const },
    { vehicleId: 'v2', type: 'tires' as const, description: 'Sostituzione pneumatici anteriori', date: new Date('2024-12-08'), odometer: 311500, cost: 890, workshop: 'Gomme Express', invoiceNumber: 'GE-2024-456', status: 'completed' as const },
    { vehicleId: 'v4', type: 'revision' as const, description: 'Revisione periodica obbligatoria', date: new Date('2024-12-05'), odometer: 420000, cost: 150, workshop: 'Centro Revisioni Auto', invoiceNumber: 'CRA-2024-789', status: 'completed' as const },
    { vehicleId: 'v3', type: 'brakes' as const, description: 'Sostituzione pastiglie freni anteriori e posteriori', date: new Date('2024-12-15'), odometer: 156200, cost: 450, workshop: 'Officina Rossi', status: 'scheduled' as const, notes: 'Prenotazione confermata per le 9:00' },
    { vehicleId: 'v5', type: 'filters' as const, description: 'Sostituzione filtro aria e filtro gasolio', date: new Date('2024-11-28'), odometer: 77800, cost: 180, workshop: 'Officina Bianchi SRL', invoiceNumber: 'FT-2024-0845', status: 'completed' as const },
    { vehicleId: 'v4', type: 'repair' as const, description: 'Riparazione impianto elettrico - sostituzione alternatore', date: new Date('2024-12-12'), odometer: 420200, cost: 680, workshop: 'Elettrauto Verdi', status: 'in_progress' as const, notes: 'In attesa ricambio alternatore' },
    { vehicleId: 'v1', type: 'tires' as const, description: 'Rotazione e bilanciatura pneumatici', date: new Date('2024-11-15'), odometer: 242500, cost: 80, workshop: 'Gomme Express', invoiceNumber: 'GE-2024-389', status: 'completed' as const },
    { vehicleId: 'v2', type: 'oil_change' as const, description: 'Cambio olio motore, filtro olio e filtro aria', date: new Date('2024-11-10'), odometer: 309800, cost: 380, workshop: 'Officina MAN Service', invoiceNumber: 'MAN-2024-1234', nextMaintenanceDate: new Date('2025-05-10'), nextMaintenanceKm: 330000, status: 'completed' as const },
    { vehicleId: 'v3', type: 'other' as const, description: 'Controllo e rabbocco liquidi (refrigerante, freni, servosterzo)', date: new Date('2024-12-20'), odometer: 156500, cost: 50, workshop: 'Officina Rossi', status: 'scheduled' as const },
    { vehicleId: 'v5', type: 'revision' as const, description: 'Revisione periodica', date: new Date('2025-01-15'), odometer: 78500, cost: 150, workshop: 'Centro Revisioni Auto', status: 'scheduled' as const, notes: 'Scadenza revisione 15/01/2025' },
  ];

  for (const m of maintenanceRecords) {
    const { vehicleId, ...data } = m;
    await prisma.maintenanceRecord.create({
      data: {
        ...data,
        vehicleId: vehicleIdMap[vehicleId],
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${vehicles.length} vehicles`);
  console.log(`   - ${drivers.length} drivers`);
  console.log(`   - ${clients.length} clients`);
  console.log(`   - ${trips.length} trips`);
  console.log(`   - ${invoices.length} invoices`);
  console.log(`   - ${fuelRecords.length} fuel records`);
  console.log(`   - ${maintenanceRecords.length} maintenance records`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
