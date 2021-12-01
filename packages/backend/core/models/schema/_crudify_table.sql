alter table client_clearwater.dm_permits
  add column id uuid default uuid_generate_v4() not null
    constraint dm_permits_pkey
      primary key;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column former_parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column status_id integer default 1
    constraint dm_permits_content_node_statuses_id_fk
      references core.content_node_statuses;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column created_at timestamp default CURRENT_TIMESTAMP;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column created_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column updated_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column updated_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column deleted_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permits
  add column deleted_by uuid;
-- SPLITTER: DO NOT REMOVE --
-- alter table client_clearwater.dm_permits
--   owner to web_admin;
-- SPLITTER: DO NOT REMOVE --
create unique index if not exists dm_permits_id_cindex
  on client_clearwater.dm_permits (id);
