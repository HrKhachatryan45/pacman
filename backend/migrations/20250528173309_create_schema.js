const _ = require('lodash')

exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('role').notNullable().defaultTo('user');
            table.string('profileImage').notNullable();
        })
        .createTable('workspaces', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.string('name').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('collections', table => {
            table.increments('id').primary();
            table.integer('workspace_id').unsigned().references('id').inTable('workspaces').onDelete('CASCADE');
            table.string('name').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('folders', table => {
            table.increments('id').primary();
            table.integer('collection_id').unsigned().references('id').inTable('collections').onDelete('CASCADE');
            table.string('name').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('requests', table => {
            table.increments('id').primary();
            table.integer('folder_id').unsigned().nullable().references('id').inTable('folders').onDelete('SET NULL');
            table.integer('collection_id').unsigned().notNullable().references('id').inTable('collections').onDelete('CASCADE');
            table.string('title').notNullable();
            table.text('url');
            table.string('method', 6);
            table.text('headers');
            table.text('body');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('requests')
        .dropTableIfExists('folders')
        .dropTableIfExists('collections')
        .dropTableIfExists('workspaces')
        .dropTableIfExists('users');
};
