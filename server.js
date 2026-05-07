const express = require("express");
const mysql = require("mysql2");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kusum0806",
  database: "schemesathi"
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ================= BASE PATH =================
const BASE_PATH = "C:/Users/HP/OneDrive/Desktop/Gov_scheme_sathi/dataset";

const folders = {
  student: path.join(BASE_PATH, "student"),
  woman: path.join(BASE_PATH, "woman"),
  sport: path.join(BASE_PATH, "sport"),
  farmer: path.join(BASE_PATH, "farmer")
};

// ================= READ EXCEL =================
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// ================= LOAD DATA =================
function loadAllData() {
  let allData = {
    student: [],
    woman: [],
    sport: [],
    farmer: []
  };

  Object.keys(folders).forEach((key) => {
    const folderPath = folders[key];

    console.log("CHECKING:", key);
    console.log("PATH:", folderPath);

    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      console.log("FILES:", files);

      files.forEach(file => {
        if (file.endsWith(".xlsx")) {
          const fullPath = path.join(folderPath, file);
          const data = readExcel(fullPath);

          allData[key] = allData[key].concat(data);
        }
      });
    } else {
      console.log("❌ FOLDER NOT FOUND:", folderPath);
    }
  });

  return allData;
}

// ================= INSERT DATA =================
function insertData(tableName, dataArray) {
  if (!dataArray.length) return;

  const keys = Object.keys(dataArray[0]);

  const values = dataArray.map(obj =>
    "(" + keys.map(k => db.escape(obj[k])).join(",") + ")"
  ).join(",");

  const sql = `INSERT INTO ${tableName} (${keys.join(",")}) VALUES ${values}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("❌ Insert Error:", err.message);
    } else {
      console.log(`✅ ${tableName} inserted: ${result.affectedRows}`);
    }
  });
}

// ================= LOAD DATA API =================
app.get("/load-data", (req, res) => {
  const data = loadAllData();

  insertData("student", data.student);
  insertData("woman", data.woman);
  insertData("sport", data.sport);
  insertData("farmer", data.farmer);

  res.json({
    message: "Data loaded successfully",
    summary: {
      student: data.student.length,
      woman: data.woman.length,
      sport: data.sport.length,
      farmer: data.farmer.length
    }
  });
});

// ================= CHECK DATA API =================
app.get("/check-data", (req, res) => {

  const queries = {
    student: "SELECT COUNT(*) AS count FROM student",
    woman: "SELECT COUNT(*) AS count FROM woman",
    sport: "SELECT COUNT(*) AS count FROM sport",
    farmer: "SELECT COUNT(*) AS count FROM farmer"
  };

  let result = {};
  let completed = 0;

  Object.keys(queries).forEach((key) => {
    db.query(queries[key], (err, data) => {
      if (err) {
        result[key] = err.message;   // show real error
      } else {
        result[key] = data[0].count;
      }

      completed++;

      if (completed === 4) {
        res.json(result);
      }
    });
  });
});

// ================= RESULT / ELIGIBLE SCHEMES API (NEW FEATURE) =================
app.post("/get-schemes", (req, res) => {
  const { category, income, age, gender } = req.body;

  let sql = "SELECT * FROM schemes WHERE 1=1";

  if (category) {
    sql += ` AND category='${category}'`;
  }

  if (income) {
    sql += ` AND min_income <= ${income}`;
  }

  if (age) {
    sql += ` AND min_age <= ${age} AND max_age >= ${age}`;
  }

  if (gender) {
    sql += ` AND (gender='all' OR gender='${gender}')`;
  }

  db.query(sql, (err, data) => {
    if (err) {
      return res.json({ error: err.message });
    }

    res.json({
      eligibleSchemes: data
    });
  });
});

// ================= START SERVER =================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});