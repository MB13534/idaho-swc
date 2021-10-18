create table app.regions
(
  id uuid default uuid_generate_v4() not null
    constraint regions_pkey
      primary key,
  parent_id uuid,
  former_parent_id uuid,
  status_id integer default 1
    constraint regions_content_node_statuses_id_fk
      references core.content_node_statuses,
  created_at timestamp default CURRENT_TIMESTAMP,
  created_by uuid,
  updated_at timestamp,
  updated_by uuid,
  deleted_at timestamp,
  deleted_by uuid,
  name text,
  lat float,
  lng float
);

create unique index if not exists regions_id_cindex
  on app.regions (id);
