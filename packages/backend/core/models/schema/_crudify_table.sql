alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column id uuid default uuid_generate_v4() not null
    constraint TOKEN_TABLE_NAME_pkey
      primary key;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column former_parent_id uuid;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column status_id integer default 1
    constraint TOKEN_TABLE_NAME_content_node_statuses_id_fk
      references core.content_node_statuses;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column created_at timestamp default CURRENT_TIMESTAMP;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column created_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column updated_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column updated_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column deleted_at timestamp;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  add column deleted_by uuid;
-- SPLITTER: DO NOT REMOVE --
alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME
  owner to TOKEN_DB_USER;
-- SPLITTER: DO NOT REMOVE --
create unique index if not exists TOKEN_TABLE_NAME_id_cindex
  on TOKEN_SCHEMA.TOKEN_TABLE_NAME (id);
