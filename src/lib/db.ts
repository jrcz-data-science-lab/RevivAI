import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';

const metaDb = new PGlite('idb://_metadata');

/**
 * Initialize the metadata database with a project name.
 */
export async function initMetadata() {
  await metaDb.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      project_name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}


// const db = new PGlite('idb://my-pg', { extensions: { vector }});

// await db.exec(`
//   CREATE TABLE IF NOT EXISTS todo (
//     id SERIAL PRIMARY KEY,
//     task TEXT,
//     done BOOLEAN DEFAULT false
//   );
//   INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
//   INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
//   INSERT INTO todo (task, done) VALUES ('Create a table', true);
//   INSERT INTO todo (task, done) VALUES ('Insert some data', true);
//   INSERT INTO todo (task) VALUES ('Update a task');
// `);

// export async function initProjects(task: string) {
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS _projects (
//       id SERIAL PRIMARY KEY,
//       name TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
    
//     INSERT INTO _projects (project_name) VALUES ('${task}');
//   `);
// }

// export function getProjectsList() {
//   return db.query(`SELECT * FROM todo`);
// }