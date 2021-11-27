alter table client_clearwater.data_well_productions
  add column id uuid default uuid_generate_v4() not null
    constraint data_well_productions_pkey
      primary key;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column former_parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column status_id integer default 1
    constraint data_well_productions_content_node_statuses_id_fk
      references core.content_node_statuses;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column created_at timestamp default CURRENT_TIMESTAMP;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column created_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column updated_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column updated_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column deleted_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  add column deleted_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.data_well_productions
  owner to web_admin;
-- SPLITTER: DO NOT REMOVE --
create unique index if not exists data_well_productions_id_cindex
  on client_clearwater.data_well_productions (id);
