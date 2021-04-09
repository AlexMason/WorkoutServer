const router = require("express").Router();
const { LogModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");
//description, definition, result, owner_id

router.post("/", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body;
  const owner_id = req.user.id;

  try {
    let newWorkout = await LogModel.create({
      description,
      definition,
      result,
      owner_id,
    });

    res.status(201).json({
      message: "Workout created successfully.",
      newWorkout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not create the workout.",
    });
  }
});

router.get("/", validateJWT, async (req, res) => {
  try {
    let workouts = await LogModel.findAll();

    res.status(200).json({
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not find any workouts.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let workout = await LogModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      workout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not find any workouts.",
    });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body;

  let query = {
    where: {
      id: req.params.id,
      owner_id: req.user.id,
    },
  };

  let updatedWorkout = {
    definition,
    description,
    result,
  };

  try {
    const update = await LogModel.update(updatedWorkout, query);

    res.status(200).json({
      updated: update > 0,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  try {
    const deleted = await LogModel.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    res.status(200).json({
      deleted: deleted > 1,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
