alter table client_clearwater.dm_permit_holders
  add column id uuid default uuid_generate_v4() not null;
--     constraint dm_permit_holders_pkey
--       primary key;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column former_parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column status_id integer default 1
    constraint dm_permit_holders_content_node_statuses_id_fk
      references core.content_node_statuses;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column created_at timestamp default CURRENT_TIMESTAMP;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column created_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column updated_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column updated_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column deleted_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table client_clearwater.dm_permit_holders
  add column deleted_by uuid;
-- SPLITTER: DO NOT REMOVE --
-- alter table client_clearwater.dm_permit_holders
--   owner to web_admin;
-- SPLITTER: DO NOT REMOVE --
create unique index if not exists dm_permit_holders_id_cindex
  on client_clearwater.dm_permit_holders (id);
