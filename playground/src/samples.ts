export const samples: Record<string, string> = {};

samples['sangam-credit'] = `-- Sangam Credit Cooperative — dogfood II. Specimens S1–S7 (see README).

-- S5: DOMAIN carrying a reusable constraint. Introspection must chase it.
CREATE DOMAIN share_amount AS NUMERIC(10,2) CHECK (VALUE >= 100);

CREATE TABLE members (
  member_id     SERIAL PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  phone         VARCHAR(10) NOT NULL CHECK (length(phone) = 10),      -- Opaque (fn)
  age           INT NOT NULL,
  guardian_member_id INT NULL REFERENCES members(member_id),
  share_balance share_amount NOT NULL,                                 -- S5 site 1
  "riskGrade"   VARCHAR(2) NOT NULL
    CONSTRAINT risk_grade_window CHECK ("riskGrade" >= 'A' AND "riskGrade" <= 'E'),  -- S6
  -- S2: OR eligibility — minors admitted with a guardian
  CONSTRAINT member_eligibility CHECK (age >= 21 OR guardian_member_id IS NOT NULL)
);

CREATE TABLE deposits (
  deposit_id   SERIAL PRIMARY KEY,
  member_id    INT NOT NULL REFERENCES members(member_id),
  amount       share_amount NOT NULL,                                  -- S5 site 2
  opened_on    DATE NOT NULL DEFAULT CURRENT_DATE,
  maturity_date DATE NOT NULL,
  rate_pct     NUMERIC(4,2) NOT NULL
    CONSTRAINT deposit_rate_window CHECK (rate_pct >= 3.5 AND rate_pct <= 9.25),
  CONSTRAINT deposit_min CHECK (amount >= 500),
  CONSTRAINT deposit_maturity_after_open CHECK (maturity_date > opened_on)  -- Opaque (cross-col)
);

CREATE TABLE loans (
  loan_id      SERIAL PRIMARY KEY,
  member_id    INT NOT NULL REFERENCES members(member_id),
  principal    NUMERIC(12,2) NOT NULL
    CONSTRAINT loan_principal_window CHECK (principal >= 1000 AND principal <= 500000),
  tenure_months INT NOT NULL CHECK (tenure_months BETWEEN 3 AND 84),   -- Opaque (BETWEEN, canary 2)
  interest_pct NUMERIC(4,2) NOT NULL CHECK (interest_pct > 0),
  -- S4: subsumption chain — the original cap and the tightening amendment
  CONSTRAINT loan_interest_cap_2019 CHECK (interest_pct <= 24),
  CONSTRAINT loan_interest_cap_2024 CHECK (interest_pct <= 18)
);

-- S1: THE NULL TRAP. guarantor columns are NULLable; in SQL three-valued
-- logic the CHECK passes when guarantor_share_pct IS NULL. The database
-- admits (NULL, NULL). CanonFlow must model optionality — a non-optional
-- Refined proof here would INVENT a constraint the DB does not enforce.
CREATE TABLE guarantees (
  loan_id             INT NOT NULL REFERENCES loans(loan_id),
  guarantor_id        INT NULL REFERENCES members(member_id),
  guarantor_share_pct NUMERIC(4,1) NULL,
  CONSTRAINT guarantor_share_floor CHECK (guarantor_share_pct >= 10),
  PRIMARY KEY (loan_id, guarantor_id)
);

CREATE TABLE ledger (
  entry_id    SERIAL PRIMARY KEY,
  member_id   INT NOT NULL REFERENCES members(member_id),
  entry_on    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- S3: negative bounds — canary specimen for the signed-number parser gap
  ledger_adjustment NUMERIC(8,2) NOT NULL
    CONSTRAINT adjustment_window CHECK (ledger_adjustment >= -5000 AND ledger_adjustment <= 5000),
  method      VARCHAR(10) NOT NULL CHECK (method IN ('cash','neft','upi'))  -- Opaque (IN)
);
`;

samples['layam-academy'] = `-- Layam Academy — dogfood schema. Every constraint is a test (see README).
CREATE TABLE gurus (
  guru_id        SERIAL PRIMARY KEY,
  full_name      VARCHAR(120) NOT NULL,
  email          VARCHAR(254) NOT NULL UNIQUE,
  years_experience INT NOT NULL CHECK (years_experience > 0),
  -- IN-list: expected to surface as Opaque (classified loss), not vanish
  specialization VARCHAR(20) NOT NULL
    CONSTRAINT guru_specialization_known
    CHECK (specialization IN ('vocal','violin','veena','mridangam','flute'))
);

CREATE TABLE students (
  student_id   SERIAL PRIMARY KEY,
  full_name    VARCHAR(120) NOT NULL,
  email        VARCHAR(254) NOT NULL UNIQUE,
  phone        VARCHAR(10)  NOT NULL CHECK (length(phone) = 10),  -- function call -> Opaque
  age          INT NOT NULL CONSTRAINT student_age_window CHECK (age >= 5 AND age <= 90),
  enrolled_on  DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE batches (
  batch_id     SERIAL PRIMARY KEY,
  guru_id      INT NOT NULL REFERENCES gurus(guru_id),
  raga_focus   VARCHAR(60),
  level        INT NOT NULL CONSTRAINT batch_level_window CHECK (level >= 1 AND level <= 8),
  capacity     INT NOT NULL CONSTRAINT batch_capacity_window CHECK (capacity > 0 AND capacity <= 12),
  fee_monthly  NUMERIC(8,2) NOT NULL
    CONSTRAINT batch_fee_window CHECK (fee_monthly >= 500 AND fee_monthly <= 15000)
);

CREATE TABLE enrollments (
  student_id   INT NOT NULL REFERENCES students(student_id),
  batch_id     INT NOT NULL REFERENCES batches(batch_id),
  discount_pct NUMERIC(4,1) NOT NULL DEFAULT 0
    CONSTRAINT enrollment_discount_window CHECK (discount_pct >= 0 AND discount_pct <= 25),
  PRIMARY KEY (student_id, batch_id)                    -- composite key (T7)
);

CREATE TABLE exams (
  exam_id         SERIAL PRIMARY KEY,
  student_id      INT NOT NULL REFERENCES students(student_id),
  batch_id        INT NOT NULL REFERENCES batches(batch_id),
  marks           INT NOT NULL CONSTRAINT exam_marks_window CHECK (marks >= 0 AND marks <= 100),
  theory_marks    INT NOT NULL DEFAULT 0,
  practical_marks INT NOT NULL DEFAULT 0,
  -- arithmetic across columns -> expected Opaque (classified loss)
  CONSTRAINT exam_split_total CHECK (theory_marks + practical_marks <= 100)
);

CREATE TABLE payments (
  payment_id  SERIAL PRIMARY KEY,
  student_id  INT NOT NULL REFERENCES students(student_id),
  batch_id    INT NOT NULL REFERENCES batches(batch_id),
  amount      NUMERIC(8,2) NOT NULL CHECK (amount > 0),
  method      VARCHAR(10) NOT NULL
    CONSTRAINT payment_method_known CHECK (method IN ('upi','card','cash')),
  paid_on     TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (student_id, batch_id) REFERENCES enrollments(student_id, batch_id)  -- composite FK
);

-- SPECIMEN 1 (deliberate): contradictory constraint pair. CanonFlow's
-- semantic optimizer (ADR-015) must collapse the conjunction to False and
-- emit a diagnostic naming both constraints. DO NOT "FIX" THIS TABLE.
CREATE TABLE scholarships (
  scholarship_id     SERIAL PRIMARY KEY,
  student_id         INT NOT NULL REFERENCES students(student_id),
  pct_waiver         NUMERIC(4,1) NOT NULL CHECK (pct_waiver > 0 AND pct_waiver <= 100),
  min_attendance_pct NUMERIC(4,1) NOT NULL,
  CONSTRAINT scholarship_attendance_floor   CHECK (min_attendance_pct > 90),
  CONSTRAINT scholarship_attendance_ceiling CHECK (min_attendance_pct < 75)
);
`;

samples['kutcheri-season'] = `CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE artists (
    artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    form TEXT NOT NULL CHECK (form IN ('Vocal', 'Violin', 'Veena', 'Mridangam', 'Flute', 'Ensemble')),
    contact TEXT,
    standard_fee_band NUMERIC(10, 2) NOT NULL CHECK (standard_fee_band >= 0)
);

CREATE TABLE venues (
    venue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    seating_capacity INTEGER NOT NULL CHECK (seating_capacity > 0),
    address TEXT NOT NULL
);

CREATE TABLE kutcheris (
    kutcheri_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES artists(artist_id),
    venue_id UUID NOT NULL REFERENCES venues(venue_id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'on-sale', 'confirmed', 'sold-out', 'on-hold', 'completed', 'cancelled')),
    artist_fee NUMERIC(10, 2) NOT NULL CHECK (artist_fee >= 0),
    venue_cost NUMERIC(10, 2) NOT NULL CHECK (venue_cost >= 0),
    CONSTRAINT kutcheri_time_check CHECK (end_time > start_time)
);

-- Note: Overlapping windows (FR-9, FR-10) typically require EXCLUDE using gist(tsrange) 
-- EXCLUDE USING gist (venue_id WITH =, tsrange(start_time, end_time) WITH &&)

CREATE TABLE ticket_tiers (
    tier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kutcheri_id UUID NOT NULL REFERENCES kutcheris(kutcheri_id),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    allocation INTEGER NOT NULL CHECK (allocation >= 0),
    sold_count INTEGER NOT NULL DEFAULT 0 CHECK (sold_count >= 0),
    CONSTRAINT tier_allocation_check CHECK (sold_count <= allocation)
);

CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id UUID NOT NULL REFERENCES ticket_tiers(tier_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    channel TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

samples['hospital-core'] = `CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE patient (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL CHECK (date_of_birth <= current_date),
    -- Age constraint: hospital policies may not allow registering deceased past a certain age, or future dates.
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F', 'O')),
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
    status TEXT NOT NULL CHECK (status IN ('REGISTERED', 'ADMITTED', 'DISCHARGED', 'DECEASED'))
);

CREATE TABLE insurance (
    insurance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient(patient_id),
    provider_name TEXT NOT NULL,
    policy_number TEXT NOT NULL UNIQUE,
    coverage_limit NUMERIC(15, 2) NOT NULL CHECK (coverage_limit >= 0),
    copay_percentage INTEGER NOT NULL CHECK (copay_percentage >= 0 AND copay_percentage <= 100),
    valid_until DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'SUSPENDED'))
);

CREATE TABLE doctor (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL CHECK (specialty IN ('GENERAL', 'CARDIOLOGY', 'NEUROLOGY', 'PEDIATRICS', 'ONCOLOGY', 'SURGERY')),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'RETIRED', 'TERMINATED'))
);

CREATE TABLE visit (
    visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patient(patient_id),
    doctor_id UUID NOT NULL REFERENCES doctor(doctor_id),
    visit_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    type TEXT NOT NULL CHECK (type IN ('OUTPATIENT', 'INPATIENT', 'EMERGENCY')),
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE prescription (
    prescription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visit(visit_id),
    doctor_id UUID NOT NULL REFERENCES doctor(doctor_id),
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0 AND duration_days <= 365),
    -- Drug restriction: controlled substances require explicit flag
    is_controlled_substance BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'FILLED', 'CANCELLED', 'EXPIRED'))
);

CREATE TABLE pharmacy (
    dispense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescription(prescription_id),
    dispensed_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    pharmacist_id UUID NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('DISPENSED', 'REJECTED_INTERACTION', 'OUT_OF_STOCK'))
);

CREATE TABLE lab (
    lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visit(visit_id),
    test_name TEXT NOT NULL,
    result_value TEXT,
    is_abnormal BOOLEAN,
    ordered_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_time TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('ORDERED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT lab_timeline CHECK (completed_time IS NULL OR completed_time >= ordered_time)
);

CREATE TABLE billing (
    bill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visit(visit_id),
    total_amount NUMERIC(15, 2) NOT NULL CHECK (total_amount >= 0),
    patient_responsibility NUMERIC(15, 2) NOT NULL CHECK (patient_responsibility >= 0),
    insurance_responsibility NUMERIC(15, 2) NOT NULL CHECK (insurance_responsibility >= 0),
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PENDING_INSURANCE', 'PATIENT_DUE', 'PAID', 'OVERDUE', 'WRITTEN_OFF')),
    CONSTRAINT billing_math CHECK (total_amount = patient_responsibility + insurance_responsibility)
);

CREATE TABLE claims (
    claim_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES billing(bill_id),
    insurance_id UUID NOT NULL REFERENCES insurance(insurance_id),
    claimed_amount NUMERIC(15, 2) NOT NULL CHECK (claimed_amount > 0),
    approved_amount NUMERIC(15, 2) CHECK (approved_amount >= 0 AND approved_amount <= claimed_amount),
    status TEXT NOT NULL CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PARTIAL_APPROVED', 'REJECTED')),
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

samples['airline-core'] = `CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE passenger (
    passenger_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passport_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    dob DATE NOT NULL CHECK (dob < current_date),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'BANNED'))
);

CREATE TABLE loyalty (
    loyalty_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES passenger(passenger_id),
    tier TEXT NOT NULL CHECK (tier IN ('BLUE', 'SILVER', 'GOLD', 'PLATINUM')),
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0)
);

CREATE TABLE aircraft (
    aircraft_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tail_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0)
);

CREATE TABLE seat (
    aircraft_id UUID NOT NULL REFERENCES aircraft(aircraft_id),
    seat_number TEXT NOT NULL,
    class TEXT NOT NULL CHECK (class IN ('ECONOMY', 'PREMIUM', 'BUSINESS', 'FIRST')),
    PRIMARY KEY (aircraft_id, seat_number)
);

CREATE TABLE flight (
    flight_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_number TEXT NOT NULL,
    aircraft_id UUID NOT NULL REFERENCES aircraft(aircraft_id),
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    origin TEXT NOT NULL CHECK (length(origin) = 3),
    destination TEXT NOT NULL CHECK (length(destination) = 3),
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'BOARDING', 'DEPARTED', 'ARRIVED', 'CANCELLED')),
    CONSTRAINT flight_time_check CHECK (arrival_time > departure_time),
    CONSTRAINT flight_route_check CHECK (origin <> destination),
    UNIQUE (flight_id, aircraft_id) -- Needed for overlapping foreign keys in booking
);

CREATE TABLE crew (
    crew_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('PILOT', 'COPILOT', 'FLIGHT_ATTENDANT', 'PURSER')),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'REST', 'ON_LEAVE'))
);

CREATE TABLE flight_crew (
    flight_id UUID NOT NULL REFERENCES flight(flight_id),
    crew_id UUID NOT NULL REFERENCES crew(crew_id),
    PRIMARY KEY (flight_id, crew_id)
);

CREATE TABLE booking (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL REFERENCES passenger(passenger_id),
    flight_id UUID NOT NULL,
    aircraft_id UUID NOT NULL,
    seat_number TEXT NOT NULL,
    booking_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL CHECK (status IN ('HOLD', 'CONFIRMED', 'CANCELLED')),
    
    -- INTERCONNECTED RULE 1: The booking must reference a valid flight and its assigned aircraft.
    FOREIGN KEY (flight_id, aircraft_id) REFERENCES flight(flight_id, aircraft_id),
    
    -- INTERCONNECTED RULE 2: The booked seat must actually exist on that specific aircraft.
    FOREIGN KEY (aircraft_id, seat_number) REFERENCES seat(aircraft_id, seat_number)
);

CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking(booking_id),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL CHECK (length(currency) = 3),
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'AUTHORIZED', 'CAPTURED', 'REFUNDED', 'FAILED')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE CHECK (length(ticket_number) = 13),
    booking_id UUID NOT NULL REFERENCES booking(booking_id),
    issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL CHECK (status IN ('ISSUED', 'USED', 'VOID'))
);
`;

samples['banking-core'] = `CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE branch (
    branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code TEXT NOT NULL UNIQUE CHECK (length(branch_code) = 4),
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CLOSED', 'SUSPENDED'))
);

CREATE TABLE employee (
    employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branch(branch_id),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('TELLER', 'MANAGER', 'AUDITOR', 'OFFICER'))
);

CREATE TABLE customer (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cif_number TEXT NOT NULL UNIQUE CHECK (length(cif_number) = 8),
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL CHECK (date_of_birth < current_date),
    risk_rating TEXT NOT NULL CHECK (risk_rating IN ('LOW', 'MEDIUM', 'HIGH')),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'DORMANT'))
);

CREATE TABLE kyc (
    kyc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer(customer_id),
    document_type TEXT NOT NULL CHECK (document_type IN ('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE')),
    document_number TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE aml (
    aml_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer(customer_id),
    screening_status TEXT NOT NULL CHECK (screening_status IN ('CLEARED', 'FLAGGED', 'UNDER_REVIEW')),
    last_screened TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE currency (
    currency_code TEXT PRIMARY KEY CHECK (length(currency_code) = 3),
    name TEXT NOT NULL
);

CREATE TABLE exchange_rate (
    rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency TEXT NOT NULL REFERENCES currency(currency_code),
    target_currency TEXT NOT NULL REFERENCES currency(currency_code),
    rate NUMERIC(10, 6) NOT NULL CHECK (rate > 0),
    effective_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE account (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer(customer_id),
    branch_id UUID NOT NULL REFERENCES branch(branch_id),
    currency TEXT NOT NULL REFERENCES currency(currency_code),
    account_type TEXT NOT NULL CHECK (account_type IN ('SAVINGS', 'CURRENT', 'LOAN', 'FD')),
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'FROZEN'))
);

CREATE TABLE limits (
    limit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    daily_transfer_limit NUMERIC(15, 2) NOT NULL CHECK (daily_transfer_limit >= 0),
    overdraft_limit NUMERIC(15, 2) NOT NULL CHECK (overdraft_limit >= 0)
);

CREATE TABLE nominee (
    nominee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    allocation_percentage INTEGER NOT NULL CHECK (allocation_percentage > 0 AND allocation_percentage <= 100)
);

CREATE TABLE interest_rate (
    rate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_type TEXT NOT NULL,
    rate_percentage NUMERIC(5, 2) NOT NULL CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
    effective_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fixed_deposit (
    fd_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    principal NUMERIC(15, 2) NOT NULL CHECK (principal > 0),
    maturity_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'MATURED', 'BROKEN'))
);

CREATE TABLE loan (
    loan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    principal_amount NUMERIC(15, 2) NOT NULL CHECK (principal_amount > 0),
    outstanding_balance NUMERIC(15, 2) NOT NULL CHECK (outstanding_balance >= 0),
    interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate >= 0),
    status TEXT NOT NULL CHECK (status IN ('DISBURSED', 'CLOSED', 'DEFAULTED'))
);

CREATE TABLE card (
    card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    card_number TEXT NOT NULL UNIQUE CHECK (length(card_number) >= 16),
    card_type TEXT NOT NULL CHECK (card_type IN ('DEBIT', 'CREDIT', 'PREPAID')),
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED'))
);

CREATE TABLE transaction (
    txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount <> 0),
    txn_type TEXT NOT NULL CHECK (txn_type IN ('CREDIT', 'DEBIT')),
    currency TEXT NOT NULL REFERENCES currency(currency_code),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    reference TEXT NOT NULL
);

CREATE TABLE ledger (
    ledger_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_id UUID NOT NULL REFERENCES transaction(txn_id),
    gl_account TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('DR', 'CR')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0)
);

CREATE TABLE charges (
    charge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_id UUID NOT NULL REFERENCES transaction(txn_id),
    charge_type TEXT NOT NULL CHECK (charge_type IN ('FEE', 'TAX', 'PENALTY')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0)
);

CREATE TABLE statement (
    statement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(account_id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance NUMERIC(15, 2) NOT NULL,
    closing_balance NUMERIC(15, 2) NOT NULL,
    CONSTRAINT valid_period CHECK (period_end > period_start)
);

CREATE TABLE audit (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_id UUID
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customer(customer_id),
    channel TEXT NOT NULL CHECK (channel IN ('SMS', 'EMAIL', 'PUSH')),
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

