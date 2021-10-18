create table TOKEN_SCHEMA.TOKEN_TABLE_NAME
(
  id uuid default uuid_generate_v4() not null
    constraint TOKEN_TABLE_NAME_pkey
      primary key,
  parent_id uuid,
  former_parent_id uuid,
  status_id integer default 1
    constraint TOKEN_TABLE_NAME_content_node_statuses_id_fk
      references core.content_node_statuses,
  created_at timestamp default CURRENT_TIMESTAMP,
  created_by uuid,
  updated_at timestamp,
  updated_by uuid,
  deleted_at timestamp,
  deleted_by uuid,
  TOKEN_DISPLAY_COLUMN_NAME text
);

alter table TOKEN_SCHEMA.TOKEN_TABLE_NAME owner to TOKEN_DB_USER;

create unique index if not exists TOKEN_TABLE_NAME_id_cindex
  on TOKEN_SCHEMA.TOKEN_TABLE_NAME (id);
