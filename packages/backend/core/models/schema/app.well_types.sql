create table app.well_types
(
  id uuid default uuid_generate_v4() not null
    constraint well_types_pkey
      primary key,
  parent_id uuid,
  former_parent_id uuid,
  status_id integer default 1
    constraint well_types_content_node_statuses_id_fk
      references core.content_node_statuses,
  created_at timestamp default CURRENT_TIMESTAMP,
  created_by uuid,
  updated_at timestamp,
  updated_by uuid,
  deleted_at timestamp,
  deleted_by uuid,
  name text
);

create unique index if not exists well_types_id_cindex
  on app.well_types (id);
