'use strict';

const test = require('ava');

const utils = require('../../lib/utils');

test.beforeEach(t => {
	t.context = Object.assign({}, utils, {
		serverless: {
			service: {
				package: {
					artifactDirectoryName: '__test__'
				}
			}
		},
    resourcesById: {},
		resourceMigrations: {},
		rootTemplate: {
			Resources: {}
		}
  });
});

test('should find no references when resourcesById is empty', t => {
	const foo = {};

	t.context.resourcesById = { foo };
	t.context.rootTemplate.Resources = { foo };

  t.context.migrate('foo', 'Bar');

	const migration = t.context.resourceMigrations['foo'];

	t.deepEqual(migration.logicalId, 'foo');
	t.true(typeof migration.stack === 'object');
	t.true(typeof migration.stackResource === 'object');
	t.true(typeof migration.stackName === 'string');
});

test('should handle repeat migrations', t => {
	const foo = {};

	t.context.resourcesById = { foo };
	t.context.rootTemplate.Resources = { foo };

  t.context.migrate('foo', 'Bar');
	t.context.migrate('foo', 'Bar');

	t.true(Object.keys(t.context.resourceMigrations).length === 1);
});

test('should throw if you try to migrate the same resource to two differnet stacks', t => {
	const foo = {};

	t.context.resourcesById = { foo };
	t.context.rootTemplate.Resources = { foo };

  t.context.migrate('foo', 'Bar');
	t.throws(() => t.context.migrate('foo', 'Baz'));
});

test('should throw if you try to migrate a resource that does not exist', t => {
	const foo = {};

	t.context.resourcesById = { foo };
	t.context.rootTemplate.Resources = { foo };

	t.throws(() => t.context.migrate('baz', 'Baz'));
});
