use rehab;

-- id: PT1234, DT1234
create table if not exists users (
	id char(6) primary key,
    `name` nvarchar(255) not null,
    `role` varchar(255) not null,
    
	-- Patient info
    doctor_id char(6),
    age int,
    address nvarchar(255),
    phone varchar(255),
    check (`role` in ('Doctor', 'Patient')),
    foreign key (doctor_id) references `users`(id)
);

create table if not exists exercises (
	id int primary key auto_increment,
    patient_id char(6) not null,
    `type` varchar(255) not null,
    check (`type` in (
		'Kimore_JumpingJacks',
		'Kimore_ArmCircles',
		'Kimore_TorsoTwists',
		'Kimore_Squats',
		'Kimore_LateralArmRaises',
		'UIPRMD_DeepSquat',
		'UIPRMD_HurdleStep',
		'UIPRMD_InlineLunge',
		'UIPRMD_SideLunge',
		'UIPRMD_SitToStand',
		'UIPRMD_StandingActiveStraightLegRaise',
		'UIPRMD_StandingShoulderAbduction',
		'UIPRMD_StandingShoulderExtension',
		'UIPRMD_StandingShoulderInternalExternalRotation',
		'UIPRMD_StandingShoulderScaption'
    )),
    score decimal(10, 2),
    submitted_at datetime default now(),
    foreign key (patient_id) references users(id)
);