alter table client_clearwater.list_permit_types
  add column id uuid default uuid_generate_v4() not null;
--     constraint list_permit_types_pkey
--       primary key;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column former_parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column status_id integer default 1
    constraint list_permit_types_content_node_statuses_id_fk
      references core.content_node_statuses;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column created_at timestamp default CURRENT_TIMESTAMP;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column created_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column updated_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column updated_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column deleted_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.list_permit_types
  add column deleted_by uuid;
-- SPLITTER: DO NOT REMOVE --
-- alter table client_clearwater.list_permit_types
--   owner to web_admin;
-- SPLITTER: DO NOT REMOVE --
create unique index if not exists list_permit_types_id_cindex
  on client_clearwater.list_permit_types (id);
