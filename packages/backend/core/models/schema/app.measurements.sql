create table app.measurements
(
  id uuid default uuid_generate_v4() not null
    constraint measurements_pkey
      primary key,
  parent_id uuid,
  former_parent_id uuid,
  status_id integer default 1
    constraint measurements_content_node_statuses_id_fk
      references core.content_node_statuses,
  created_at timestamp default CURRENT_TIMESTAMP,
  created_by uuid,
  updated_at timestamp,
  updated_by uuid,
  deleted_at timestamp,
  deleted_by uuid,
  well_id uuid,
  reading1 float,
  reading2 float,
  reading3 float,
  reading_date timestamp
);

create unique index if not exists measurements_id_cindex
  on app.measurements (id);
