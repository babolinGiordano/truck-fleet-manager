-- ============================================================================
-- SEED DEMO - Consorzio autotrasporti
-- ============================================================================
-- Repeatable migration (prefisso R__): Flyway la riesegue ogni volta che il
-- contenuto cambia, sempre DOPO le migration di schema versionate.
--
-- Ripetibile per costruzione: azzera i dati di dominio e li reinserisce con
-- ID deterministici (demo-*), quindi rilanciarla non duplica mai i record.
--
-- Tutte le date sono relative a CURRENT_DATE: rilanciando il seed i dati
-- tornano ancorati a "oggi" e la demo non invecchia.
--
-- NOTA SCHEMA: gli enum sono varchar UPPERCASE (vedi V2), le colonne sono
-- camelCase quotate (eredità Prisma).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Azzeramento (ordine dettato dalle foreign key)
-- ---------------------------------------------------------------------------
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM fuel_records;
DELETE FROM maintenance_records;
DELETE FROM trips;
DELETE FROM drivers;
DELETE FROM vehicles;
DELETE FROM clients;

-- ---------------------------------------------------------------------------
-- 2. Clienti (spedizionieri, GDO, industria)
-- ---------------------------------------------------------------------------
INSERT INTO clients (id, "companyName", "vatNumber", "fiscalCode", address, city, province, "postalCode", country, phone, email, pec, "sdiCode", "contactPerson", "isActive", "createdAt", "updatedAt") VALUES
('demo-cli-01', 'Spedizioni Marchetti S.p.A.',      '02845710963', '02845710963', 'Via Ludovico il Moro 142',  'Milano',  'MI', '20143', 'Italia', '02 8134 5520', 'traffico@spedizionimarchetti.it',  'spedizionimarchetti@pec.it',  'M5UXCR1', 'Elena Marchetti',  true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-02', 'Trasporti Adriatici S.r.l.',       '01732450428', '01732450428', 'Via Flaminia 214',          'Ancona',  'AN', '60126', 'Italia', '071 285 4410', 'operativo@trasportiadriatici.it',  'trasportiadriatici@pec.it',   'KRRH6B9', 'Fabio Serrani',    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-03', 'Distribuzione Centro Italia S.r.l.','09218740587', '09218740587', 'Via Salaria 1027',          'Roma',    'RM', '00138', 'Italia', '06 8890 3312', 'acquisti@distcentroitalia.it',     'distcentroitalia@pec.it',     'USAL8PV', 'Giorgio Fanelli',  true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-04', 'Supermercati Padani S.p.A.',       '03412870371', '03412870371', 'Via dell''Industria 88',    'Bologna', 'BO', '40138', 'Italia', '051 601 7730', 'logistica@supermercatipadani.it',  'supermercatipadani@pec.it',   'A4707H7', 'Chiara Bertoldi',  true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-05', 'Acciaierie Vallesina S.p.A.',      '02198450179', '02198450179', 'Via Orzinuovi 310',         'Brescia', 'BS', '25125', 'Italia', '030 355 8890', 'spedizioni@acciaierievallesina.it','acciaierievallesina@pec.it',  'W7YVJK9', 'Roberto Zanetti',  true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-06', 'Ceramiche Sassolesi S.r.l.',       '02736410365', '02736410365', 'Via Radici in Piano 425',   'Modena',  'MO', '41049', 'Italia', '0536 812 240', 'export@ceramichesassolesi.it',     'ceramichesassolesi@pec.it',   'SUBM70N', 'Marta Vaccari',    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-07', 'Logistica Tirrenica S.r.l.',       '01584730995', '01584730995', 'Via San Benedetto 27',      'Genova',  'GE', '16126', 'Italia', '010 246 7715', 'traffico@logisticatirrenica.it',   'logisticatirrenica@pec.it',   'T04ZHR3', 'Andrea Parodi',    true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-08', 'Ortofrutta del Sud S.r.l.',        '06914520726', '06914520726', 'Via Santa Caterina 96',     'Bari',    'BA', '70122', 'Italia', '080 521 9940', 'ordini@ortofruttadelsud.it',       'ortofruttadelsud@pec.it',     'XL13LG4', 'Vito Lorusso',     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-cli-09', 'Chimica Padana S.p.A.',            '04127630281', '04127630281', 'Via della Croce Rossa 112', 'Padova',  'PD', '35129', 'Italia', '049 773 6680', 'logistica@chimicapadana.it',       'chimicapadana@pec.it',        'RZWCTL8', 'Silvia Callegaro', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 3. Veicoli: 5 motrici + 2 semirimorchi
-- ---------------------------------------------------------------------------
-- Scadenze pianificate perche' la dashboard mostri:
--   urgenti (<=30gg): veh-01 revisione +25, veh-02 assicurazione +18
--   avvicinamento (30-90gg): veh-03 assicurazione +75, veh-04 revisione +55
--   tutte le altre oltre i 90 giorni. Nessuna scaduta.
INSERT INTO vehicles (id, plate, brand, model, year, status, "currentDriverId", "lastLat", "lastLng", "lastPositionAt", "kmTotal", "insuranceExpiry", "revisionExpiry", notes, "createdAt", "updatedAt") VALUES
('demo-veh-01', 'GK481TR', 'Iveco',    'S-Way 480',        2022, 'IN_TRANSIT', 'demo-drv-01', 44.4949, 11.3426, CURRENT_TIMESTAMP - INTERVAL '40 minutes', 285400, (CURRENT_DATE + 240)::timestamp, (CURRENT_DATE + 25)::timestamp,  'Motrice - trattore stradale',            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-02', 'HN732PL', 'Scania',   'R 450',            2021, 'IN_TRANSIT', 'demo-drv-02', 43.7696, 11.2558, CURRENT_TIMESTAMP - INTERVAL '15 minutes', 412800, (CURRENT_DATE + 18)::timestamp,  (CURRENT_DATE + 200)::timestamp, 'Motrice - trattore stradale',            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-03', 'FT295BC', 'Volvo',    'FH 500',           2023, 'IN_TRANSIT', 'demo-drv-03', 41.9028, 12.4964, CURRENT_TIMESTAMP - INTERVAL '8 minutes',  168200, (CURRENT_DATE + 75)::timestamp,  (CURRENT_DATE + 310)::timestamp, 'Motrice - trattore stradale',            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-04', 'JD614MW', 'Mercedes', 'Actros 1848',      2020, 'AVAILABLE',  NULL,          45.4642,  9.1900, CURRENT_TIMESTAMP - INTERVAL '6 hours',   524600, (CURRENT_DATE + 160)::timestamp, (CURRENT_DATE + 55)::timestamp,  'Motrice - trattore stradale',            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-05', 'EV358RN', 'MAN',      'TGX 18.470',       2019, 'MAINTENANCE',NULL,          45.5416, 10.2118, CURRENT_TIMESTAMP - INTERVAL '2 days',    698300, (CURRENT_DATE + 300)::timestamp, (CURRENT_DATE + 180)::timestamp, 'Motrice - in officina per tagliando',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-06', 'XB472KL', 'Krone',    'Profi Liner SD',   2021, 'AVAILABLE',  NULL,          NULL,     NULL,   NULL,                                      142900, (CURRENT_DATE + 280)::timestamp, (CURRENT_DATE + 130)::timestamp, 'Semirimorchio centinato 13.6m - 34 EPAL',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-veh-07', 'XC916DP', 'Schmitz',  'Cargobull S.KO 24',2022, 'AVAILABLE',  NULL,          NULL,     NULL,   NULL,                                       98700, (CURRENT_DATE + 210)::timestamp, (CURRENT_DATE + 340)::timestamp, 'Semirimorchio frigo 13.6m - ATP',        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 4. Autisti (patenti CE + CQC, visita medica in notes)
-- ---------------------------------------------------------------------------
-- Scadenze pianificate:
--   urgente (<=30gg): drv-01 CQC +22
--   avvicinamento (30-90gg): drv-03 CQC +65, drv-02 CQC +85
--   tutte le altre oltre i 90 giorni. Nessuna scaduta.
INSERT INTO drivers (id, "firstName", "lastName", "fiscalCode", phone, email, "licenseNumber", "licenseExpiry", "cqcExpiry", "adrExpiry", status, "assignedVehicleId", "hireDate", notes, "createdAt", "updatedAt") VALUES
('demo-drv-01', 'Marco',   'Ferrari',  'FRRMRC82L14F205K', '335 418 2210', 'm.ferrari@consorzio.it',  'MI7742180K', (CURRENT_DATE + 400)::timestamp,  (CURRENT_DATE + 22)::timestamp,  NULL,                            'ACTIVE', 'demo-veh-01', (CURRENT_DATE - 2190)::timestamp, 'Patente CE. Visita medica: ' || to_char(CURRENT_DATE + 145, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-drv-02', 'Luca',    'Ricci',    'RCCLCU79E03H501T', '347 226 8834', 'l.ricci@consorzio.it',    'RM6318925C', (CURRENT_DATE + 500)::timestamp,  (CURRENT_DATE + 85)::timestamp,  (CURRENT_DATE + 120)::timestamp, 'ACTIVE', 'demo-veh-02', (CURRENT_DATE - 2920)::timestamp, 'Patente CE + ADR cisterne. Visita medica: ' || to_char(CURRENT_DATE + 210, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-drv-03', 'Andrea',  'Costa',    'CSTNDR88T22A944J', '340 771 4429', 'a.costa@consorzio.it',    'BO5140672M', (CURRENT_DATE + 700)::timestamp,  (CURRENT_DATE + 65)::timestamp,  NULL,                            'ACTIVE', 'demo-veh-03', (CURRENT_DATE - 1460)::timestamp, 'Patente CE. Visita medica: ' || to_char(CURRENT_DATE + 95, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-drv-04', 'Stefano', 'Greco',    'GRCSFN75B18L219P', '333 902 5517', 's.greco@consorzio.it',    'TO4429183B', (CURRENT_DATE + 900)::timestamp,  (CURRENT_DATE + 250)::timestamp, (CURRENT_DATE + 180)::timestamp, 'ACTIVE', 'demo-veh-04', (CURRENT_DATE - 3650)::timestamp, 'Patente CE + ADR. Visita medica: ' || to_char(CURRENT_DATE + 260, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-drv-05', 'Davide',  'Rinaldi',  'RNLDVD91M09D612R', '349 335 7762', 'd.rinaldi@consorzio.it',  'FI8827401D', (CURRENT_DATE + 1100)::timestamp, (CURRENT_DATE + 320)::timestamp, NULL,                            'ACTIVE', NULL,          (CURRENT_DATE - 730)::timestamp,  'Patente CE. Visita medica: ' || to_char(CURRENT_DATE + 300, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-drv-06', 'Paolo',   'Mancini',  'MNCPLA84D27G273V', '338 617 2093', 'p.mancini@consorzio.it',  'PA3315889G', (CURRENT_DATE + 600)::timestamp,  (CURRENT_DATE + 400)::timestamp, (CURRENT_DATE + 290)::timestamp, 'ON_LEAVE', NULL,        (CURRENT_DATE - 1825)::timestamp, 'Patente CE + ADR. In ferie fino al ' || to_char(CURRENT_DATE + 12, 'DD/MM/YYYY'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 5. Viaggi storici COMPLETATI (~70, ultimi 12 mesi)
-- ---------------------------------------------------------------------------
-- Densita': 45 viaggi negli ultimi 90 giorni (1 ogni 2 gg), 25 nei 9 mesi
-- precedenti (1 ogni 11 gg) -> concentrazione ~5x sugli ultimi 3 mesi.
-- Tariffa €/km decrescente sulla distanza (mercato FTL: 1,10-1,40 €/km).
WITH routes(rid, o_addr, o_city, o_prov, o_cap, o_lat, o_lng, d_addr, d_city, d_prov, d_cap, d_lat, d_lng, km, cargo, peso) AS (VALUES
  (0,  'Interporto, Via Nino Bixio 11',    'Bologna', 'BO', '40132', 44.4949, 11.3426, 'Zona Industriale, Via Napoli 330','Bari',    'BA', '70123', 41.1171, 16.8719, 680, 'Prodotti alimentari confezionati - 33 EPAL', 24500.0),
  (1,  'Via Orbassano 220',                'Torino',  'TO', '10137', 45.0703,  7.6869, 'Interporto Sud, Via Nolana 45',   'Napoli',  'NA', '80144', 40.8518, 14.2681, 900, 'Componenti automotive - 28 EPAL',           21800.0),
  (2,  'Via Mecenate 90',                  'Milano',  'MI', '20138', 45.4642,  9.1900, 'Via Tiburtina 1145',              'Roma',    'RM', '00156', 41.9028, 12.4964, 575, 'Materiale elettrico - 30 EPAL',             19200.0),
  (3,  'Via Orzinuovi 310',                'Brescia', 'BS', '25125', 45.5416, 10.2118, 'Via Emilia Ovest 1180',           'Modena',  'MO', '41123', 44.6471, 10.9252, 145, 'Coils acciaio - carico pesante',            26800.0),
  (4,  'Via Radici in Piano 425',          'Modena',  'MO', '41049', 44.6471, 10.9252, 'Porto, Via Milano 51',            'Genova',  'GE', '16126', 44.4056,  8.9463, 200, 'Ceramiche su pallet - 26 EPAL',             27400.0),
  (5,  'Via della Croce Rossa 112',        'Padova',  'PD', '35129', 45.4064, 11.8768, 'Via Marghera 28',                 'Venezia', 'VE', '30175', 45.4830, 12.2440,  40, 'Prodotti chimici ADR - cisterna',           22000.0),
  (6,  'Via Salaria 1027',                 'Roma',    'RM', '00138', 41.9028, 12.4964, 'Via Nazionale delle Puglie 220',  'Napoli',  'NA', '80013', 40.8518, 14.2681, 225, 'GDO - misto secco 32 EPAL',                 18600.0),
  (7,  'Via Flaminia 214',                 'Ancona',  'AN', '60126', 43.6158, 13.5189, 'Via Emilia Levante 88',           'Bologna', 'BO', '40139', 44.4949, 11.3426, 210, 'Elettrodomestici - 24 EPAL',                14900.0),
  (8,  'Via Ludovico il Moro 142',         'Milano',  'MI', '20143', 45.4642,  9.1900, 'Interporto, Via Nino Bixio 11',   'Bologna', 'BO', '40132', 44.4949, 11.3426, 210, 'Groupage industriale - 30 EPAL',            16700.0),
  (9,  'Via Santa Caterina 96',            'Bari',    'BA', '70122', 41.1171, 16.8719, 'Mercato Ortofrutticolo, Via Sardegna 4','Verona','VR','37135', 45.4384, 10.9916, 780, 'Ortofrutta fresca - temperatura +4C',       23200.0),
  (10, 'Via San Benedetto 27',             'Genova',  'GE', '16126', 44.4056,  8.9463, 'Via Emilia Est 1450',             'Parma',   'PR', '43122', 44.8015, 10.3279, 200, 'Merce varia pallettizzata - 28 EPAL',       17300.0),
  (11, 'Via Sardegna 4',                   'Verona',  'VR', '37135', 45.4384, 10.9916, 'Via Baldanzese 17',               'Firenze', 'FI', '50041', 43.7696, 11.2558, 240, 'Beverage - 31 EPAL',                        25100.0)
),
seq AS (
  SELECT i,
         CASE WHEN i <= 45
              THEN i * 2                      -- 2..90 giorni fa: alta densita'
              ELSE 90 + ((i - 45) * 11)       -- 101..365 giorni fa: bassa densita'
         END AS days_ago
  FROM generate_series(1, 70) AS i
),
plan AS (
  SELECT
    s.i,
    s.days_ago,
    r.*,
    -- tariffa di mercato: piu' bassa sulle lunghe percorrenze
    (CASE WHEN r.km > 600 THEN 1.12
          WHEN r.km > 300 THEN 1.20
          WHEN r.km > 150 THEN 1.30
          ELSE 1.38 END)::numeric(10,2) AS eur_km,
    (CURRENT_DATE - s.days_ago)::timestamp + INTERVAL '6 hours' + (s.i % 4) * INTERVAL '1 hour' AS dep
  FROM seq s
  -- passo 5 (coprimo con 12): tocca tutte le tratte ma senza allinearle alla
  -- data, altrimenti ogni finestra temporale pescherebbe tratte di valore
  -- simile e il fatturato mensile oscillerebbe per puro artefatto del seed
  JOIN routes r ON r.rid = ((s.i * 5) % 12)
)
INSERT INTO trips (id, "tripNumber", "vehicleId", "driverId", "clientId",
                   "originCompany", "originAddress", "originCity", "originProvince", "originPostalCode", "originCountry", "originLat", "originLng",
                   "destCompany", "destAddress", "destCity", "destProvince", "destPostalCode", "destCountry", "destLat", "destLng",
                   "cargoDescription", "cargoWeight", "cargoVolume", "cargoPackages", "cargoIsADR",
                   status, "plannedDeparture", "actualDeparture", "plannedArrival", "actualArrival",
                   "kmPlanned", "kmActual", price, notes, "createdAt", "updatedAt")
SELECT
  'demo-trip-' || lpad(p.i::text, 4, '0'),
  'VG-' || to_char(p.dep, 'YYYY') || '-' || lpad(p.i::text, 4, '0'),
  'demo-veh-0' || (1 + (p.i % 5)),                 -- solo motrici (01..05)
  'demo-drv-0' || (1 + (p.i % 5)),                 -- drv-06 e' in ferie
  'demo-cli-0' || (1 + (p.i % 9)),
  NULL, p.o_addr, p.o_city, p.o_prov, p.o_cap, 'Italia', p.o_lat, p.o_lng,
  NULL, p.d_addr, p.d_city, p.d_prov, p.d_cap, 'Italia', p.d_lat, p.d_lng,
  p.cargo, p.peso, round((p.peso / 320.0)::numeric, 1), 20 + (p.i % 14), (p.rid = 5),
  'COMPLETED',
  p.dep,
  p.dep + INTERVAL '12 minutes' * (p.i % 5),
  p.dep + INTERVAL '1 hour' * (p.km / 65.0 + 2),
  p.dep + INTERVAL '1 hour' * (p.km / 65.0 + 2) + INTERVAL '9 minutes' * (p.i % 7),
  p.km,
  p.km + (p.i % 11) - 3,                            -- km reali leggermente diversi dai pianificati
  round((p.km * p.eur_km)::numeric, 2),
  NULL,
  p.dep - INTERVAL '6 days',
  CURRENT_TIMESTAMP
FROM plan p;

-- ---------------------------------------------------------------------------
-- 5b. Viaggi completati IERI (3)
-- ---------------------------------------------------------------------------
-- Servono a dare un termine di paragone reale al KPI "Viaggi oggi" (che si
-- confronta con ieri) e chiudono dove partono i viaggi di oggi: ogni motrice
-- arriva in serata nella citta' da cui riparte stamattina, con oltre 11 ore
-- di riposo fra un turno e l'altro.
INSERT INTO trips (id, "tripNumber", "vehicleId", "driverId", "clientId",
                   "originCompany", "originAddress", "originCity", "originProvince", "originPostalCode", "originCountry", "originLat", "originLng",
                   "destCompany", "destAddress", "destCity", "destProvince", "destPostalCode", "destCountry", "destLat", "destLng",
                   "cargoDescription", "cargoWeight", "cargoVolume", "cargoPackages", "cargoIsADR",
                   status, "plannedDeparture", "actualDeparture", "plannedArrival", "actualArrival",
                   "kmPlanned", "kmActual", price, notes, "createdAt", "updatedAt") VALUES
('demo-trip-9201', 'VG-' || to_char(CURRENT_DATE - 1, 'YYYY') || '-9201', 'demo-veh-01', 'demo-drv-01', 'demo-cli-01',
 NULL, 'Via Sardegna 4', 'Verona', 'VR', '37135', 'Italia', 45.4384, 10.9916,
 NULL, 'Interporto, Via Nino Bixio 11', 'Bologna', 'BO', '40132', 'Italia', 44.4949, 11.3426,
 'Beverage - 31 EPAL', 25100.0, 78.4, 31, false,
 'COMPLETED', (CURRENT_DATE - 1)::timestamp + INTERVAL '13 hours', (CURRENT_DATE - 1)::timestamp + INTERVAL '13 hours 10 minutes',
 (CURRENT_DATE - 1)::timestamp + INTERVAL '16 hours 30 minutes', (CURRENT_DATE - 1)::timestamp + INTERVAL '16 hours 48 minutes',
 140, 143, 193.20, NULL, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP),
('demo-trip-9202', 'VG-' || to_char(CURRENT_DATE - 1, 'YYYY') || '-9202', 'demo-veh-02', 'demo-drv-02', 'demo-cli-09',
 NULL, 'Via Marghera 28', 'Venezia', 'VE', '30175', 'Italia', 45.4830, 12.2440,
 NULL, 'Via della Croce Rossa 112', 'Padova', 'PD', '35129', 'Italia', 45.4064, 11.8768,
 'Prodotti chimici ADR - cisterna', 21400.0, 66.8, 1, true,
 'COMPLETED', (CURRENT_DATE - 1)::timestamp + INTERVAL '14 hours', (CURRENT_DATE - 1)::timestamp + INTERVAL '14 hours 5 minutes',
 (CURRENT_DATE - 1)::timestamp + INTERVAL '15 hours 20 minutes', (CURRENT_DATE - 1)::timestamp + INTERVAL '15 hours 35 minutes',
 40, 42, 55.20, NULL, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP),
('demo-trip-9203', 'VG-' || to_char(CURRENT_DATE - 1, 'YYYY') || '-9203', 'demo-veh-03', 'demo-drv-03', 'demo-cli-07',
 NULL, 'Via Orbassano 220', 'Torino', 'TO', '10137', 'Italia', 45.0703, 7.6869,
 NULL, 'Via Mecenate 90', 'Milano', 'MI', '20138', 'Italia', 45.4642, 9.1900,
 'Merce varia pallettizzata - 28 EPAL', 17300.0, 54.1, 28, false,
 'COMPLETED', (CURRENT_DATE - 1)::timestamp + INTERVAL '12 hours 30 minutes', (CURRENT_DATE - 1)::timestamp + INTERVAL '12 hours 40 minutes',
 (CURRENT_DATE - 1)::timestamp + INTERVAL '15 hours', (CURRENT_DATE - 1)::timestamp + INTERVAL '15 hours 12 minutes',
 140, 138, 193.20, NULL, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 6. Viaggi IN CORSO oggi (3) - alimentano "Viaggi oggi" e "Veicoli in transito"
-- ---------------------------------------------------------------------------
INSERT INTO trips (id, "tripNumber", "vehicleId", "driverId", "clientId",
                   "originCompany", "originAddress", "originCity", "originProvince", "originPostalCode", "originCountry", "originLat", "originLng",
                   "destCompany", "destAddress", "destCity", "destProvince", "destPostalCode", "destCountry", "destLat", "destLng",
                   "cargoDescription", "cargoWeight", "cargoVolume", "cargoPackages", "cargoIsADR",
                   status, "plannedDeparture", "actualDeparture", "plannedArrival", "actualArrival",
                   "kmPlanned", "kmActual", price, notes, "createdAt", "updatedAt") VALUES
('demo-trip-9001', 'VG-' || to_char(CURRENT_DATE, 'YYYY') || '-9001', 'demo-veh-01', 'demo-drv-01', 'demo-cli-04',
 'Supermercati Padani S.p.A.', 'Interporto, Via Nino Bixio 11', 'Bologna', 'BO', '40132', 'Italia', 44.4949, 11.3426,
 'Piattaforma Bari', 'Zona Industriale, Via Napoli 330', 'Bari', 'BA', '70123', 'Italia', 41.1171, 16.8719,
 'Prodotti alimentari confezionati - 33 EPAL', 24500.0, 76.5, 33, false,
 'IN_PROGRESS', CURRENT_DATE::timestamp + INTERVAL '5 hours 30 minutes', CURRENT_DATE::timestamp + INTERVAL '5 hours 42 minutes',
 CURRENT_DATE::timestamp + INTERVAL '16 hours', NULL, 680, NULL, 761.60, 'Consegna entro le 16:00', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP),
('demo-trip-9002', 'VG-' || to_char(CURRENT_DATE, 'YYYY') || '-9002', 'demo-veh-02', 'demo-drv-02', 'demo-cli-09',
 'Chimica Padana S.p.A.', 'Via della Croce Rossa 112', 'Padova', 'PD', '35129', 'Italia', 45.4064, 11.8768,
 'Deposito Firenze', 'Via Baldanzese 17', 'Firenze', 'FI', '50041', 'Italia', 43.7696, 11.2558,
 'Prodotti chimici ADR - cisterna', 22000.0, 68.7, 1, true,
 'IN_PROGRESS', CURRENT_DATE::timestamp + INTERVAL '6 hours', CURRENT_DATE::timestamp + INTERVAL '6 hours 8 minutes',
 CURRENT_DATE::timestamp + INTERVAL '13 hours 30 minutes', NULL, 265, NULL, 344.50, 'Trasporto ADR - scorta documenti a bordo', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP),
('demo-trip-9003', 'VG-' || to_char(CURRENT_DATE, 'YYYY') || '-9003', 'demo-veh-03', 'demo-drv-03', 'demo-cli-03',
 'Distribuzione Centro Italia S.r.l.', 'Via Mecenate 90', 'Milano', 'MI', '20138', 'Italia', 45.4642, 9.1900,
 'Hub Roma Tiburtina', 'Via Tiburtina 1145', 'Roma', 'RM', '00156', 'Italia', 41.9028, 12.4964,
 'Materiale elettrico - 30 EPAL', 19200.0, 60.0, 30, false,
 'IN_PROGRESS', CURRENT_DATE::timestamp + INTERVAL '4 hours 45 minutes', CURRENT_DATE::timestamp + INTERVAL '5 hours',
 CURRENT_DATE::timestamp + INTERVAL '14 hours 15 minutes', NULL, 575, NULL, 690.00, NULL, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 7. Viaggi PIANIFICATI (4: uno oggi nel pomeriggio, tre nei prossimi giorni)
-- ---------------------------------------------------------------------------
INSERT INTO trips (id, "tripNumber", "vehicleId", "driverId", "clientId",
                   "originCompany", "originAddress", "originCity", "originProvince", "originPostalCode", "originCountry", "originLat", "originLng",
                   "destCompany", "destAddress", "destCity", "destProvince", "destPostalCode", "destCountry", "destLat", "destLng",
                   "cargoDescription", "cargoWeight", "cargoVolume", "cargoPackages", "cargoIsADR",
                   status, "plannedDeparture", "actualDeparture", "plannedArrival", "actualArrival",
                   "kmPlanned", "kmActual", price, notes, "createdAt", "updatedAt") VALUES
('demo-trip-9101', 'VG-' || to_char(CURRENT_DATE, 'YYYY') || '-9101', 'demo-veh-04', 'demo-drv-04', 'demo-cli-05',
 'Acciaierie Vallesina S.p.A.', 'Via Orzinuovi 310', 'Brescia', 'BS', '25125', 'Italia', 45.5416, 10.2118,
 'Stabilimento Modena', 'Via Emilia Ovest 1180', 'Modena', 'MO', '41123', 'Italia', 44.6471, 10.9252,
 'Coils acciaio - carico pesante', 26800.0, 12.4, 6, false,
 'PLANNED', CURRENT_DATE::timestamp + INTERVAL '15 hours', NULL, CURRENT_DATE::timestamp + INTERVAL '18 hours', NULL,
 145, NULL, 200.10, 'Carico programmato ore 15:00', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP),
('demo-trip-9102', 'VG-' || to_char(CURRENT_DATE + 1, 'YYYY') || '-9102', 'demo-veh-04', 'demo-drv-05', 'demo-cli-08',
 'Ortofrutta del Sud S.r.l.', 'Via Santa Caterina 96', 'Bari', 'BA', '70122', 'Italia', 41.1171, 16.8719,
 'Mercato Ortofrutticolo', 'Via Sardegna 4', 'Verona', 'VR', '37135', 'Italia', 45.4384, 10.9916,
 'Ortofrutta fresca - temperatura +4C', 23200.0, 72.5, 30, false,
 'PLANNED', (CURRENT_DATE + 1)::timestamp + INTERVAL '5 hours', NULL, (CURRENT_DATE + 1)::timestamp + INTERVAL '19 hours', NULL,
 780, NULL, 873.60, 'Semirimorchio frigo XC916DP - pre-raffreddare', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-trip-9103', 'VG-' || to_char(CURRENT_DATE + 3, 'YYYY') || '-9103', 'demo-veh-05', 'demo-drv-04', 'demo-cli-06',
 'Ceramiche Sassolesi S.r.l.', 'Via Radici in Piano 425', 'Modena', 'MO', '41049', 'Italia', 44.6471, 10.9252,
 'Terminal Genova', 'Porto, Via Milano 51', 'Genova', 'GE', '16126', 'Italia', 44.4056, 8.9463,
 'Ceramiche su pallet - 26 EPAL', 27400.0, 68.0, 26, false,
 'PLANNED', (CURRENT_DATE + 3)::timestamp + INTERVAL '7 hours', NULL, (CURRENT_DATE + 3)::timestamp + INTERVAL '12 hours', NULL,
 200, NULL, 260.00, 'Consegna per imbarco', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-trip-9104', 'VG-' || to_char(CURRENT_DATE + 5, 'YYYY') || '-9104', 'demo-veh-01', 'demo-drv-01', 'demo-cli-01',
 'Spedizioni Marchetti S.p.A.', 'Via Ludovico il Moro 142', 'Milano', 'MI', '20143', 'Italia', 45.4642, 9.1900,
 'Interporto Bologna', 'Interporto, Via Nino Bixio 11', 'Bologna', 'BO', '40132', 'Italia', 44.4949, 11.3426,
 'Groupage industriale - 30 EPAL', 16700.0, 52.2, 30, false,
 'PLANNED', (CURRENT_DATE + 5)::timestamp + INTERVAL '8 hours', NULL, (CURRENT_DATE + 5)::timestamp + INTERVAL '12 hours', NULL,
 210, NULL, 273.00, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- 8. Fatture sui viaggi completati
-- ---------------------------------------------------------------------------
-- Emissione a 2 giorni dalla consegna, pagamento a 30 giorni.
--
-- Lo stato dipende da QUANDO la fattura viene pagata, non da quando scade:
-- ogni cliente salda fra 24 e 35 giorni dall'emissione (chi anticipa e chi
-- tarda). Legare lo stato alla scadenza introdurrebbe un'asimmetria nel KPI
-- "Fatturato mese": il mese in corso perderebbe i pagamenti anticipati delle
-- fatture non ancora scadute, mentre il mese chiuso li conterebbe tutti.
--
-- Le insolute (OVERDUE) vengono poi promosse con un UPDATE mirato, per
-- controllarne il numero esatto senza dipendere da una formula sul totale.
WITH fatturabili AS (
  SELECT t.id AS trip_id, t."clientId", t.price, t."actualArrival", t."originCity", t."destCity",
         row_number() OVER (ORDER BY t."actualArrival") AS rn
  FROM trips t
  WHERE t.status = 'COMPLETED' AND t."actualArrival" >= CURRENT_DATE - 210
),
calc AS (
  SELECT f.*,
         (f."actualArrival" + INTERVAL '2 days')::timestamp  AS issue_date,
         (f."actualArrival" + INTERVAL '32 days')::timestamp AS due_date,
         -- saldo effettivo: 24..35 giorni dall'emissione (scadenza a 30)
         (f."actualArrival" + INTERVAL '2 days' + INTERVAL '1 day' * (24 + (f.rn % 12)))::timestamp AS paid_moment
  FROM fatturabili f
)
INSERT INTO invoices (id, "invoiceNumber", "clientId", "issueDate", "dueDate", status, subtotal, "vatRate", "vatAmount", total, notes, "paidDate", "createdAt", "updatedAt")
SELECT
  'demo-inv-' || lpad(c.rn::text, 4, '0'),
  'FT-' || to_char(c.issue_date, 'YYYY') || '-' || lpad(c.rn::text, 4, '0'),
  c."clientId",
  c.issue_date,
  c.due_date,
  CASE WHEN c.paid_moment <= CURRENT_TIMESTAMP THEN 'PAID' ELSE 'SENT' END,
  c.price,
  22.00,
  round((c.price * 0.22)::numeric, 2),
  round((c.price * 1.22)::numeric, 2),
  NULL,
  CASE WHEN c.paid_moment <= CURRENT_TIMESTAMP THEN c.paid_moment ELSE NULL END,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM calc c;

-- Esattamente 2 insolute, fra le scadute da almeno 4 giorni.
-- Il margine evita di marcare come insoluta una fattura che scade oggi:
-- sarebbe incoerente con l'avviso ("scade oggi") mostrato in dashboard.
UPDATE invoices SET status = 'OVERDUE', "paidDate" = NULL
WHERE id IN (
  SELECT id FROM invoices
  WHERE status = 'PAID' AND "dueDate" < CURRENT_DATE - 3
  ORDER BY "dueDate" DESC
  LIMIT 2
);

INSERT INTO invoice_items (id, "invoiceId", description, quantity, "unitPrice", "totalPrice", "tripId")
SELECT
  'demo-item-' || lpad(c.rn::text, 4, '0'),
  'demo-inv-' || lpad(c.rn::text, 4, '0'),
  'Trasporto ' || c."originCity" || ' - ' || c."destCity" || ' del ' || to_char(c."actualArrival", 'DD/MM/YYYY'),
  1,
  c.price,
  c.price,
  c.trip_id
FROM (
  SELECT t.id AS trip_id, t.price, t."actualArrival", t."originCity", t."destCity",
         row_number() OVER (ORDER BY t."actualArrival") AS rn
  FROM trips t
  WHERE t.status = 'COMPLETED' AND t."actualArrival" >= CURRENT_DATE - 210
) c;

-- ---------------------------------------------------------------------------
-- 9. Rifornimenti (consumo ~30 l/100km, gasolio ~1,65 €/l)
-- ---------------------------------------------------------------------------
-- Un rifornimento ogni due viaggi completati; odometro coerente con kmTotal
-- del mezzo scalato all'indietro nel tempo (~300 km/giorno).
INSERT INTO fuel_records (id, "vehicleId", "driverId", date, liters, "pricePerLiter", "totalCost", "fuelType", "stationName", odometer, "fullTank", notes, "createdAt", "updatedAt")
SELECT
  'demo-fuel-' || lpad(f.rn::text, 4, '0'),
  f."vehicleId",
  f."driverId",
  f."actualArrival" - INTERVAL '2 hours',
  round((f."kmActual" * 0.30)::numeric, 2),
  round((1.629 + (f.rn % 9) * 0.0075)::numeric, 4),
  round((f."kmActual" * 0.30 * (1.629 + (f.rn % 9) * 0.0075))::numeric, 2),
  'DIESEL',
  (ARRAY['Eni Station A1 Secchia Ovest','Q8 Autostrada Est','IP Cantagallo Sud','Esso Somaglia Ovest','Tamoil Casello Nord'])[1 + (f.rn % 5)],
  GREATEST(f."kmTotal" - (EXTRACT(DAY FROM (CURRENT_TIMESTAMP - f."actualArrival")) * 300)::int, 15000),
  true,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (
  SELECT t.id, t."vehicleId", t."driverId", t."actualArrival", t."kmActual", v."kmTotal",
         row_number() OVER (ORDER BY t."actualArrival") AS rn
  FROM trips t
  JOIN vehicles v ON v.id = t."vehicleId"
  WHERE t.status = 'COMPLETED' AND t."actualArrival" >= CURRENT_DATE - 180
) f
WHERE f.rn % 2 = 0;

-- ---------------------------------------------------------------------------
-- 10. Manutenzioni: tagliandi, revisioni, gomme, freni
-- ---------------------------------------------------------------------------
-- Storico completato + interventi programmati (questi ultimi compaiono negli
-- avvisi di dashboard tramite nextMaintenanceDate).
INSERT INTO maintenance_records (id, "vehicleId", type, description, date, odometer, cost, workshop, "invoiceNumber", "nextMaintenanceDate", "nextMaintenanceKm", status, notes, "createdAt", "updatedAt") VALUES
-- storico
('demo-mnt-01', 'demo-veh-01', 'OIL_CHANGE', 'Tagliando 90.000 km - olio motore, filtri olio/aria/gasolio', (CURRENT_DATE - 96)::timestamp,  255300, 842.00,  'Officina Iveco Emilia - Bologna',   'OF-2210', NULL, 375000, 'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-02', 'demo-veh-02', 'TIRES',      'Sostituzione 4 pneumatici asse trattivo 315/80 R22.5',        (CURRENT_DATE - 142)::timestamp, 385100, 2180.00, 'Gommista Pneus Service - Firenze',  'PS-0884', NULL, NULL,   'COMPLETED', 'Michelin X Multi D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-03', 'demo-veh-03', 'BRAKES',     'Sostituzione pastiglie e dischi anteriori',                   (CURRENT_DATE - 58)::timestamp,  152800, 1265.00, 'Autofficina Volvo Lazio - Roma',    'VL-1147', NULL, NULL,   'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-04', 'demo-veh-04', 'REVISION',   'Revisione ministeriale annuale - esito regolare',             (CURRENT_DATE - 310)::timestamp, 478200, 168.00,  'Centro Revisioni MCTC - Milano',    'MC-3390', NULL, NULL,   'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-05', 'demo-veh-06', 'FILTERS',    'Controllo impianto frenante semirimorchio e ingrassaggio',    (CURRENT_DATE - 74)::timestamp,  138400, 395.00,  'Officina Rimorchi Padana - Brescia','RP-0521', NULL, NULL,   'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-06', 'demo-veh-01', 'FILTERS',    'Sostituzione filtro antiparticolato e AdBlue',                (CURRENT_DATE - 28)::timestamp,  276900, 1120.00, 'Officina Iveco Emilia - Bologna',   'OF-2388', NULL, NULL,   'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-07', 'demo-veh-02', 'OIL_CHANGE', 'Tagliando 400.000 km - olio, filtri, controllo cinghie',      (CURRENT_DATE - 19)::timestamp,  407600, 968.00,  'Scania Service Toscana - Firenze',  'SS-7712', NULL, 480000, 'COMPLETED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- in corso: coerente con veh-05 in stato MAINTENANCE
('demo-mnt-08', 'demo-veh-05', 'OIL_CHANGE', 'Tagliando 700.000 km + sostituzione frizione',                (CURRENT_DATE - 2)::timestamp,   698300, 3450.00, 'MAN Service Lombardia - Brescia',   NULL,      NULL, 760000, 'IN_PROGRESS', 'Mezzo fermo, riconsegna prevista in 2 giorni', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- programmate: generano avvisi in dashboard
('demo-mnt-09', 'demo-veh-03', 'OIL_CHANGE', 'Tagliando 175.000 km',                                        (CURRENT_DATE + 9)::timestamp,   168200, 890.00,  'Autofficina Volvo Lazio - Roma',    NULL,      (CURRENT_DATE + 9)::timestamp,  175000, 'SCHEDULED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-10', 'demo-veh-04', 'TIRES',      'Sostituzione pneumatici asse anteriore',                      (CURRENT_DATE + 21)::timestamp,  524600, 1240.00, 'Gommista Pneus Service - Milano',   NULL,      (CURRENT_DATE + 21)::timestamp, NULL,   'SCHEDULED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-11', 'demo-veh-01', 'REVISION',   'Revisione ministeriale annuale',                              (CURRENT_DATE + 24)::timestamp,  285400, 168.00,  'Centro Revisioni MCTC - Bologna',   NULL,      (CURRENT_DATE + 24)::timestamp, NULL,   'SCHEDULED', 'Da prenotare presso motorizzazione', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-mnt-12', 'demo-veh-07', 'FILTERS',    'Controllo gruppo frigo e ATP semirimorchio',                  (CURRENT_DATE + 47)::timestamp,   98700, 520.00,  'Frigo Service Nord - Verona',       NULL,      (CURRENT_DATE + 47)::timestamp, NULL,   'SCHEDULED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
