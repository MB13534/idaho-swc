create table if not exists core.users
(
	id uuid default uuid_generate_v4() not null
		constraint users_pk
			primary key,
	auth0_sub text,
	nickname text,
	email text,
	picture_url text,
	is_email_verified boolean,
	is_admin boolean default false,
	active boolean default true,
	created_at timestamp default CURRENT_TIMESTAMP,
	created_by uuid,
	updated_at timestamp,
	updated_by uuid
);

create unique index if not exists users_id_uindex
	on core.users (id);

