create table core.content_node_statuses
(
	id serial not null
		constraint content_node_statuses_pk
			primary key,
	name text not null
);

INSERT INTO core.content_node_statuses (id, name) VALUES (1, 'Draft');
INSERT INTO core.content_node_statuses (id, name) VALUES (2, 'Published');
INSERT INTO core.content_node_statuses (id, name) VALUES (3, 'Updated');
