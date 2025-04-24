create database if not exists rehab;
use rehab;

-- id: PT1234, DT1234
create table if not exists users (
	Id char(6) primary key,
    `Name` nvarchar(255) not null,
    `Role` varchar(255) not null,
    
	-- Patient info
    DoctorId char(6),
    Age int,
    Address nvarchar(255),
    Phone varchar(255),
    check (`Role` in ('Doctor', 'Patient')),
    foreign key (DoctorId) references `users`(Id)
);

create table if not exists exercises (
	Id int primary key auto_increment,
    PatientId char(6) not null,
    `Type` varchar(255) not null,
    check (`Type` in (
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
    Score decimal(10, 2),
    Duration decimal(10, 2),
    SubmittedAt datetime default now(),
    foreign key (PatientId) references users(Id)
);

insert into users(Id, `Name`, `Role`) values ('DT1234', 'Doan Quoc Bao', 'Doctor');
insert into users(Id, `Name`, `Role`, DoctorId, Age, Address, Phone) values ('PT1234', 'Nguyen Tien Dat', 'Patient', 'DT1234', 20, 'Ha Noi', '0123456789');
