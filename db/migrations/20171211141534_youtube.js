
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary;
    table.string('name');
  })
    .createTable('videos',(table) => {
      table.increments('video_id').primary;
      table.string('category');
      table.integer('length');
      table.integer('view_count');
      table.integer('likes');
      table.integer('user_id').references('users.user_id');
      table.boolean('is_ad');
      table.integer('ad').references('videos.video_id');
    })
    .createTable('channel', (table) => {
      table.increments('channel_id').primary;
      table.string('channel_name');
      table.integer('user_id').references('users.user_id');
    })
    .createTable('ads', (table) => {
      table.increments('ad_id').primary;
      table.string('category');
      table.string('banner');
      table.string('link');
      table.integer('video_id').references('videos.video_id');
      table.integer('tier');
    })
    .createTable('subscriber', (table) => {
      table.increments('subscriber_id').primary;
      table.integer('user_id').references('users.user_id');
      table.integer('channel_id').references('channel.channel_id');
    })
    .createTable('videos_in_channel', (table) => {
      table.increments('id').primary;
      table.integer('video_id').references('videos.video_id');
      table.integer('channel_id').references('channel.channel_id');
    });
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('videos_in_channel')
    .dropTable('subscriber')
    .dropTable('ads')
    .dropTable('channel')
    .dropTable('videos')
    .dropTable('users');
};
