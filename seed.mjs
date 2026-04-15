import pool from "./src/lib/db.mjs";

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Clean existing data (except seats - handled separately)
    await client.query(
      "TRUNCATE showtimes, movies, bookings RESTART IDENTITY CASCADE",
    );

    const movies = [
      {
        tmdb_id: 1523145,
        title: "Your Heart Will Be Broken",
        poster_path:
          "https://image.tmdb.org/t/p/w500/7wIBfBl2gejt6xHxNSK0reVIm7E.jpg",
        rating: 7.1,
      },
      {
        tmdb_id: 1226863,
        title: "The Super Mario Galaxy Movie",
        poster_path:
          "https://image.tmdb.org/t/p/w500/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg",
        rating: 6.8,
      },
      {
        tmdb_id: 83533,
        title: "Avatar: Fire and Ash",
        poster_path:
          "https://image.tmdb.org/t/p/w500/cf7hE1ifY4UNbS25tGnaTyyDrI2.jpg",
        rating: 7.4,
      },
      {
        tmdb_id: 502356,
        title: "The Super Mario Bros. Movie",
        poster_path:
          "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
        rating: 7.6,
      },
      {
        tmdb_id: 1327819,
        title: "Hoppers",
        poster_path:
          "https://image.tmdb.org/t/p/w500/xjtWQ2CL1mpmMNwuU5HeS4Iuwuu.jpg",
        rating: 7.6,
      },
      {
        tmdb_id: 687163,
        title: "Project Hail Mary",
        poster_path:
          "https://image.tmdb.org/t/p/w500/yihdXomYb5kTeSivtFndMy5iDmf.jpg",
        rating: 8.2,
      },
      {
        tmdb_id: 1641319,
        title: "Sniper: No Nation",
        poster_path:
          "https://image.tmdb.org/t/p/w500/3T9nAX0jAp0iT18ex25BlZEpRDb.jpg",
        rating: 6.0,
      },
      {
        tmdb_id: 1290417,
        title: "Thrash",
        poster_path:
          "https://image.tmdb.org/t/p/w500/adk8weka3O5648g3de4z3y4aE7G.jpg",
        rating: 6.0,
      },
      {
        tmdb_id: 1290821,
        title: "Shelter",
        poster_path:
          "https://image.tmdb.org/t/p/w500/buPFnHZ3xQy6vZEHxbHgL1Pc6CR.jpg",
        rating: 6.8,
      },
      {
        tmdb_id: 840464,
        title: "Greenland 2: Migration",
        poster_path:
          "https://image.tmdb.org/t/p/w500/z2tqCJLsw6uEJ8nJV8BsQXGa3dr.jpg",
        rating: 6.5,
      },
      {
        tmdb_id: 1171145,
        title: "Crime 101",
        poster_path:
          "https://image.tmdb.org/t/p/w500/tVvpFIoteRHNnoZMhdnwIVwJpCA.jpg",
        rating: 7.0,
      },
      {
        tmdb_id: 1470130,
        title: "The Mortuary Assistant",
        poster_path:
          "https://image.tmdb.org/t/p/w500/72AoFPC5TY4DfJwXXS9rPwPeReD.jpg",
        rating: 5.6,
      },
      {
        tmdb_id: 1297842,
        title: "GOAT",
        poster_path:
          "https://image.tmdb.org/t/p/w500/wfuqMlaExcoYiUEvKfVpUTt1v4u.jpg",
        rating: 7.9,
      },
      {
        tmdb_id: 1049471,
        title: "Outcome",
        poster_path:
          "https://image.tmdb.org/t/p/w500/kSzcpfbTy2pXHGvrVU2WhQTo6oU.jpg",
        rating: 5.3,
      },
      {
        tmdb_id: 1159831,
        title: "The Bride!",
        poster_path:
          "https://image.tmdb.org/t/p/w500/lV8YHwGkYZsm6EfIqnhaSz2avKt.jpg",
        rating: 6.2,
      },
      {
        tmdb_id: 1159559,
        title: "Scream 7",
        poster_path:
          "https://image.tmdb.org/t/p/w500/jjyuk0edLiW8vOSnlfwWCCLpbh5.jpg",
        rating: 6.0,
      },
      {
        tmdb_id: 1265609,
        title: "War Machine",
        poster_path:
          "https://image.tmdb.org/t/p/w500/tlPgDzwIE7VYYIIAGCTUOnN4wI1.jpg",
        rating: 7.2,
      },
      {
        tmdb_id: 1115544,
        title: "Mike & Nick & Nick & Alice",
        poster_path:
          "https://image.tmdb.org/t/p/w500/7F0jc75HrSkLVcvOXR2FXAIwuEv.jpg",
        rating: 6.8,
      },
      {
        tmdb_id: 1084187,
        title: "Pretty Lethal",
        poster_path:
          "https://image.tmdb.org/t/p/w500/znTPnXCK3lEQJgqXCvP7e5FUz6f.jpg",
        rating: 6.9,
      },
      {
        tmdb_id: 1311031,
        title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
        poster_path:
          "https://image.tmdb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg",
        rating: 7.7,
      },

      {
        tmdb_id: 1582770,
        title: "Dhurandhar The Revenge",
        poster_path:
          "https://image.tmdb.org/t/p/w500/ov8vrRLZGoXHpYjSY9Vpv1tHJX7.jpg",
        rating: 6.9,
      },
      {
        tmdb_id: 848538,
        title: "Dhurandhar",
        poster_path:
          "https://image.tmdb.org/t/p/w500/snBOuXDdhmTvlzMUvP9Em3Pp1u1.jpg",
        rating: 7.0,
      },
    ];

    for (const movie of movies) {
      await client.query(
        "INSERT INTO movies (tmdb_id, title, poster_path, rating) VALUES ($1, $2, $3, $4)",
        [movie.tmdb_id, movie.title, movie.poster_path, movie.rating],
      );
    }

    const now = new Date();
    const showtimeTemplates = [
      {
        movie_id: 1,
        screens: [
          { screen: 6, hours: [10, 14, 18] },
          { screen: 7, hours: [11, 15, 19] },
          { screen: 8, hours: [12, 16] },
        ],
      },
      {
        movie_id: 2,
        screens: [
          { screen: 9, hours: [10, 14, 17, 20] },
          { screen: 10, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 3,
        screens: [
          { screen: 6, hours: [12, 16, 19, 21] },
          { screen: 7, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 4,
        screens: [
          { screen: 8, hours: [10, 14, 17, 20] },
          { screen: 9, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 5,
        screens: [
          { screen: 10, hours: [12, 16, 19, 21] },
          { screen: 6, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 6,
        screens: [
          { screen: 7, hours: [10, 14, 17, 20] },
          { screen: 8, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 7,
        screens: [
          { screen: 9, hours: [12, 16, 19, 21] },
          { screen: 10, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 8,
        screens: [
          { screen: 6, hours: [10, 14, 17, 20] },
          { screen: 7, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 9,
        screens: [
          { screen: 8, hours: [12, 16, 19, 21] },
          { screen: 9, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 10,
        screens: [
          { screen: 10, hours: [10, 14, 17, 20] },
          { screen: 6, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 11,
        screens: [
          { screen: 7, hours: [12, 16, 19, 21] },
          { screen: 8, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 12,
        screens: [
          { screen: 9, hours: [10, 14, 17, 20] },
          { screen: 10, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 13,
        screens: [
          { screen: 6, hours: [12, 16, 19, 21] },
          { screen: 7, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 14,
        screens: [
          { screen: 8, hours: [10, 14, 17, 20] },
          { screen: 9, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 15,
        screens: [
          { screen: 10, hours: [12, 16, 19, 21] },
          { screen: 6, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 16,
        screens: [
          { screen: 7, hours: [10, 14, 17, 20] },
          { screen: 8, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 17,
        screens: [
          { screen: 9, hours: [12, 16, 19, 21] },
          { screen: 10, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 18,
        screens: [
          { screen: 6, hours: [10, 14, 17, 20] },
          { screen: 7, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 19,
        screens: [
          { screen: 8, hours: [12, 16, 19, 21] },
          { screen: 9, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 20,
        screens: [
          { screen: 10, hours: [10, 14, 17, 20] },
          { screen: 6, hours: [11, 15, 18] },
        ],
      },
      {
        movie_id: 21,
        screens: [
          { screen: 7, hours: [12, 16, 19, 21] },
          { screen: 8, hours: [13, 17, 20] },
        ],
      },
      {
        movie_id: 22,
        screens: [
          { screen: 9, hours: [10, 14, 17, 20] },
          { screen: 10, hours: [11, 15, 18] },
        ],
      },
    ];

    for (const template of showtimeTemplates) {
      for (const screenConfig of template.screens) {
        for (const hour of screenConfig.hours) {
          const showTime = new Date(now);
          showTime.setDate(showTime.getDate() + 1);
          showTime.setHours(hour, 0, 0, 0);

          await client.query(
            "INSERT INTO showtimes (movie_id, screen_number, show_time) VALUES ($1, $2, $3)",
            [template.movie_id, screenConfig.screen, showTime],
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log("Seed complete");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seed error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
