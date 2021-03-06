exports.up = async (knex) => {
  await knex.schema
  .createTable('students', (students) => {
      students.increments('student_id')
      students.string('username', 100).notNullable().unique()
      students.string('password', 100).notNullable()
      students.string('role', 10).defaultTo('student')
    })
    .createTable('instructors', (inst) => {
      inst.increments('instructor_id')
      inst.string('username', 100).notNullable().unique()
      inst.string('password', 100).notNullable()
      inst.string('role', 10).defaultTo('instructor')
    })
    .createTable('classes', (classes) => {
      classes.increments('class_id')
      classes.string('class_name', 100).notNullable().unique()
      classes.time('class_start_time').notNullable()
      classes.string('class_category', 100).notNullable()
      classes.integer('class_duration').notNullable()
      classes.string('class_level', 50).notNullable()
      classes.string('class_location', 50).notNullable()
      classes.integer('total_students').defaultTo(0)
      classes.integer('max_students').notNullable().defaultTo(8)
      classes.integer('instructor_id')
      .unsigned()
      .notNullable()
      .references('instructor_id')
      .inTable('instructors')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    })
    .createTable('reservations', (res) => {
      res.increments('reservation_id')
      res.integer('class_id')
      .unsigned()
      .notNullable()
      .references('class_id')
      .inTable('classes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      res.integer('student_id')
      .unsigned()
      .notNullable()
      .references('student_id')
      .inTable('students')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('reservations')
  await knex.schema.dropTableIfExists('classes')
  await knex.schema.dropTableIfExists('instructors')
  await knex.schema.dropTableIfExists('students') 
}
