
// const User = require("../../models/qlcnew/user");
const functions = require("../../services/functions");
const FormCaculateTinhluong = require("../../models/qlcnew/FormCaculateTinhluong");
const SampleDefinationVarTinhluong = require("../../models/qlcnew/tinhluongexcel/SampleDefinationVarTinhluong");
const DefinationVariableTinhluong = require("../../models/qlcnew/tinhluongexcel/DefinationVariableTinhluong");
const Cellvalue = require("../../models/qlcnew/cellvalue");


//Hàm rách số ra khỏi chữ
function extractNumber(cellReference) {
  return parseInt(cellReference.match(/\d+/)[0]);
}
// Hàm kiếm tra số trong mảng giống nhau không
function checkSame(arr) {
  if (arr.length === 0) {
    return true; // Nếu mảng rỗng, coi như các phần tử giống nhau
  }

  const firstElement = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== firstElement) {
      return false; // Nếu tìm thấy phần tử khác, trả về false
    }
  }

  return true; // Nếu không tìm thấy phần tử khác, coi như các phần tử giống nhau
}

//Hàm loại bỏ dấu 
function removeVietnameseAccent(str) {
  const map = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  return str.replace(/[^A-Za-z0-9\s]/g, c => map[c] || c);
}
// Hàm handle để format lại note_var thành name_var
function formatNoteVar(NoteVar) {
  let ConvertToEnglish = removeVietnameseAccent(NoteVar)
  let RemoveSpecialCharacter = ConvertToEnglish.replace(/[^\w\s]/gi, '');
  let RemoveSpace = RemoveSpecialCharacter.replace(/\s+/g, ' ');
  let RemoveFirstSpace = RemoveSpace.trim();
  let ToLowCase = RemoveFirstSpace.toLowerCase();
  var NameVar = ToLowCase.replace(/\s/g, '_');
  return NameVar;
}



// API để tạo công thức
exports.CreateForm = async (req, res) => {
  try {
    const { com_id, form_caculate, user_edit } = req.body;
    const time_created = new Date();
    const time_edited = time_created;
    //Lấy ra mảng các số để kiểm tra có cùng một hàng không
    // const form_caculate_cell = form_caculate.match(/[A-Z]\d+/g);
    // const rowNumbers = [];
    // for (const i of form_caculate_cell) {
    //   const rowNumber = extractNumber(i);
    //   rowNumbers.push(rowNumber);
    // }
    // if (!checkSame(rowNumbers)) {
    //   return res.status(400).json({ message: 'Các hạng tử phải nằm trên cùng một hàng' });

    // }

    // Kiểm tra sự tồn tại của com_id
      const Formula = await FormCaculateTinhluong.findOne({ com_id });
      if (Formula) {
        // Sửa công thức nếu com_id đã tồn tại
        Formula.form_caculate = form_caculate;
        Formula.user_edit = user_edit;
        Formula.time_edited = time_edited;

        await Formula.save();
        functions.success(res, "Thêm công thức thành công", { Formula })

      } else {
        const Formula = new FormCaculateTinhluong({
          com_id,
          form_caculate,
          user_edit,
          time_created,
          time_edited,
        });

        await Formula.save();
        functions.success(res, "Thêm công thức thành công", { Formula })
      }
    }
   catch (error) {
    res.status(500).json({ message: 'Error creating formula' });
  };
}


// API để sửa công thức
exports.EditForm = async (req, res) => {

  try {
    // const com_id = req.params.com_id;
    let {
      com_id,
      form_caculate,
      user_edit
    } = req.body;


    //Lấy ra mảng các số để kiểm tra có cùng một hàng không
    const form_caculate_cell = form_caculate.match(/[A-Z]\d+/g);
    const rowNumbers = [];
    for (const i of form_caculate_cell) {
      const rowNumber = extractNumber(i);
      rowNumbers.push(rowNumber);
    }
    if (!checkSame(rowNumbers)) {
      functions.setError(res, "các hạng tử phải nằm trên cùng một hàng", 510);

    }
    const newFormula = await FormCaculateTinhluong.findOne({ com_id: com_id });
    if (!newFormula) {
      functions.setError(res, "công thức không tồn tại!", 510);
    } else {
      // Cập nhật thông tin công thức tính
      newFormula.form_caculate = form_caculate;
      newFormula.user_edit = user_edit;
      newFormula.time_edited = new Date();

    }
    await newFormula.save();

    functions.success(res, "Cập nhật công thức tính thành công", { newFormula })
  } catch (error) {
    functions.setError(res, "cập nhật thất bại!", 510);
  }
};


//API thực hiện tính lương
exports.Calculate = async (req, res) => {
  try {
    const { cell, com_id } = req.body;
    // Lấy công thức từ cơ sở dữ liệu dựa trên com_id
    const formCaculate = await FormCaculateTinhluong.findOne({ com_id });
    if (!formCaculate || !formCaculate.form_caculate) {
      res.status(404).json({ error: 'Không tìm thấy công thức tính lương cho công ty' });
      return;
    }
    const formula = formCaculate.form_caculate;

    // Kiểm tra công thức trước khi tính toán
    if (!formula) {
      res.status(400).json({ error: 'Công thức không hợp lệ' });
      return;
    }
    // Lấy giá trị từ cơ sở dữ liệu cho các ô trong công thức
    const operands = formula.match(/[A-Z]+\d+|\d+[A-Z]+/g);


    var newformula = formula
    for (const operand of operands) {
      const cellValue = await Cellvalue.findOne({ cell: operand });
      let tempValue = cellValue ? cellValue.value : 0;
      newformula = newformula.replace(operand, tempValue);
      newformula = newformula.replace(/^=/, '')

    }
    var answer = eval(newformula)
    var result = answer.toFixed(2);
    //Kiểm tra ô đã có trong cơ sở dữ liệu chưa nếu có thì sửa còn chưa có thì thêm mới
    const cellvalue = await Cellvalue.findOne({ cell, com_id });
    if (cellvalue) {
      cellvalue.value = result;
      await cellvalue.save();
    } else {
      const newCellValue = new Cellvalue({ com_id, cell, value: result });
      await newCellValue.save();
    }


    functions.success(res, "Thực hiện tính thành công", { result })

  } catch (error) {
    // Nếu xảy ra lỗi trong quá trình tính toán, trả về phản hồi lỗi
    functions.setError(res, "Lỗi tính toán!", 510);
  }
};

// API để xem  công thức theo công ty
exports.GetFormCompany = async (req, res) => {
  try {
    const { com_id } = req.body;
    const data = await functions.getDatafind(FormCaculateTinhluong, { com_id: com_id });
    if (data) {
      return await functions.success(res, 'Lấy công thức thành công', { data });
    };
    return functions.setError(res, 'Không có dữ liệu', 404);
  } catch (err) {
    functions.setError(res, err.message);
  }
};





//API thêm, sửa giá trị một ô
exports.SetCellValue = async (req, res) => {
  try {
    const { com_id, cell, value } = req.body;
    const cellPattern = /^[A-Z]+\d+$/;
    if (!cellPattern.test(cell)) {
      functions.setError(res, "Invalid cell format. Cell must be in the format like A1, A2, B3, ...");
      return;
    }
    if (isNaN(com_id)) {
      functions.setError(res, "Id must be a number");
    } else {
      const data = await Cellvalue.findOne({ com_id, cell });

      if (data) {
        data.value = value;
        await data.save();
        functions.success(res, 'Giá trị đã được cập nhật', { cellValue: data })

      } else {
        const newCellValue = new Cellvalue({ com_id, cell, value })
        await newCellValue.save();
        functions.success(res, 'Giá trị đã được thêm mới', { cellValue: newCellValue });
      }
    }
  } catch (error) {
    functions.setError(res, "thêm giá trị thất bại!", 510);

  }
};

//Api xem tất cả các ô
exports.getAllCellValue = async (req, res) => {
  try {
    const allCellValues = await Cellvalue.find();
    functions.success(res, 'Xem danh sách các ô thành công!', { allCellValues })
  } catch (error) {
    functions.setError(res, "Lỗi truy vấn dữ liệu!", 510);

  }
};


//Api lấy ra một ô của một công ty
exports.getOneCellValue = async (req, res) => {
  try {
    const { com_id, cell: cell } = req.body;
    const data = await functions.getDatafind(Cellvalue, { com_id: com_id, cell: cell });
    if (data) {
      return await functions.success(res, 'Lấy dữ liệu các ô thành c', { data });
    };
  } catch (error) {
    functions.setError(res, "Lỗi truy vấn dữ liệu!", 510);

  }
};

//Api lấy các ô theo công ty
exports.getAllCellValueCompany = async (req, res) => {
  try {
    const { com_id } = req.body;
    const data = await functions.getDatafind(Cellvalue, { com_id: com_id });
    // if (data) {
    //   return await functions.success(res, 'Lấy dữ liệu các ô thành c', { data });
    // };
    if (data) {
      // Sắp xếp dữ liệu theo khóa "cell" tăng dần
      const sortedData = data.sort((a, b) => {
        if (a.cell < b.cell) {
          return -1;
        }
        if (a.cell > b.cell) {
          return 1;
        }
        return 0;
      });

      return await functions.success(res, 'Lấy dữ liệu các ô thành c', { data: sortedData });
    }
    return functions.setError(res, 'Không có dữ liệu', 404);
  } catch (err) {
    functions.setError(res, err.message);
  }
};




// //Api lấy các ô theo công ty
// exports.getDataCellCompany = async (req, res) => {
//   try {
//     const { com_id } = req.body;
//     const data = await functions.getDatafind(Cellvalue, { com_id: com_id });

//     if (data) {
//       // Sắp xếp dữ liệu theo khóa "cell" tăng dần
//       const sortedData = data.sort((a, b) => {
//         if (a.cell < b.cell) {
//           return -1;
//         }
//         if (a.cell > b.cell) {
//           return 1;
//         }
//         return 0;
//       });

//       const transformedData = sortedData.map(item => {
//         return `${item.cell}:${item.value}`;
//       });

//       const columns = Array.from({ length: 40 }, (_, index) => String.fromCharCode(65 + index)); // Tạo một mảng chứa các chữ cái A-Z tương ứng với số cột

//       const resultData = columns.map(column => {
//         return transformedData.filter(item => item.startsWith(`${column}:`));
//       });

//       return await functions.success(res, 'Lấy dữ liệu các ô thành c', { data: resultData });
//     }

//     return functions.setError(res, 'Không có dữ liệu', 404);
//   } catch (err) {
//     functions.setError(res, err.message);
//   }
// };



//API thực hiện tính lương
exports.Calculate = async (req, res) => {
  try {
    const { cell, com_id } = req.body;
    // Lấy công thức từ cơ sở dữ liệu dựa trên com_id
    const formCaculate = await FormCaculateTinhluong.findOne({ com_id });
    if (!formCaculate || !formCaculate.form_caculate) {
      res.status(404).json({ error: 'Không tìm thấy công thức tính lương cho công ty' });
      return;
    }
    const formula = formCaculate.form_caculate;

    // Kiểm tra công thức trước khi tính toán
    if (!formula) {
      res.status(400).json({ error: 'Công thức không hợp lệ' });
      return;
    }
    // Lấy giá trị từ cơ sở dữ liệu cho các ô trong công thức
    const operands = formula.match(/[A-Z]+\d+|\d+[A-Z]+/g);


    var newformula = formula
    for (const operand of operands) {
      const cellValue = await Cellvalue.findOne({ cell: operand });
      let tempValue = cellValue ? cellValue.value : 0;
      newformula = newformula.replace(operand, tempValue);
      newformula = newformula.replace(/^=/, '')

    }
    var answer = eval(newformula)
    var result = answer.toFixed(2);
    //Kiểm tra ô đã có trong cơ sở dữ liệu chưa nếu có thì sửa còn chưa có thì thêm mới
    const cellvalue = await Cellvalue.findOne({ cell, com_id });
    if (cellvalue) {
      cellvalue.value = result;
      await cellvalue.save();
    } else {
      const newCellValue = new Cellvalue({ com_id, cell, value: result });
      await newCellValue.save();
    }


    functions.success(res, "Thực hiện tính thành công", { result })

  } catch (error) {
    // Nếu xảy ra lỗi trong quá trình tính toán, trả về phản hồi lỗi
    functions.setError(res, "Lỗi tính toán!", 510);
  }
};



//Tạo một cột header (note_var) mới trong ô tính lương
exports.CreateNewColum = async (req, res) => {
  const {
    note_var,
    name_var
  } = req.body;

  if (!note_var) {
    functions.setError(res, "note_var required");
  } else if (!name_var) {
    functions.setError(res, "name_var required");
  } else {
    let maxId = await functions.getMaxID(SampleDefinationVarTinhluong);
    if (!maxId) {
      maxId = 0;
    }
    const _id = Number(maxId) + 1;
    const SampleDefinationVarTinhluongs = new SampleDefinationVarTinhluong({
      _id: _id,
      note_var: note_var,
      name_var: name_var
    });
    await SampleDefinationVarTinhluongs.save()
      .then(() => {
        functions.success(res, "SampleDefinationVarTinhluong saved successfully", SampleDefinationVarTinhluongs);
      })
      .catch(err => functions.setError(res, err.message));
  }
}





//Tạo mới một biến tính lương(thêm cột) trong ô tính lương
exports.CreateVarTinhLuong = async (req, res) => {
  const {
    note_var,
    com_id
  } = req.body;
  const name_var = formatNoteVar(note_var)

  if (!note_var) {
    functions.setError(res, "note_var required");
  } else if (!com_id) {
    functions.setError(res, "com_id required");
  } else if (isNaN(com_id)) {
    functions.setError(res, "Com_id must be a number");
  } else {
    let maxId = await functions.getMaxID(DefinationVariableTinhluong);
    if (!maxId) {
      maxId = 0;
    }
    const _id = Number(maxId) + 1;
    const DefinationVariableTinhluongs = new DefinationVariableTinhluong({
      _id: _id,
      com_id: com_id,
      note_var: note_var,
      name_var: name_var,

    });
    await DefinationVariableTinhluongs.save()
      .then(() => {
        functions.success(res, "DefinationVarTinhluong saved successfully", DefinationVariableTinhluongs);
      })
      .catch(err => functions.setError(res, err.message));
  }
}


//Lấy tất cả biến tính lương
exports.getAllVarTinhLuong = async (req, res) => {
  await functions.getDatafind(DefinationVariableTinhluong, {})
    .then((data) => functions.success(res, "Get data successfully", data))
    .catch((err) => functions.setError(res, err.message))
}


// lấy danh sách biến tính lương một công ty
exports.getAllVarTinhLuongCompany = async (req, res) => {

  try {
    const com_id = req.body.com_id;

    const data = await functions.getDatafind(DefinationVariableTinhluong, { com_id: com_id });

    if (data) {
      return await functions.success(res, 'Lấy biến tính lương thành công', { data });
    };
    return functions.setError(res, 'Không có dữ liệu', 404);
  } catch (err) {
    functions.setError(res, err.message);
  };

}
//Sửa một cột mới (note_var) trong ô tính lương
exports.EditVarTinhLuong = async (req, res) => {
  const _id = req.params.id;
  if (isNaN(_id)) {
    functions.setError(res, "Id must be a number");
  } else {
    const note_var = req.body.note_var
    const name_var = formatNoteVar(note_var)
    const variableTinhluong = await functions.getDatafindOne(DefinationVariableTinhluong, { _id: _id });
    if (!variableTinhluong) {
      functions.setError(res, "variableTinhluong does not exist");
    } else {
      await functions.getDatafindOneAndUpdate(DefinationVariableTinhluong, { _id: _id }, {

        note_var: note_var,
        name_var: name_var,
        // time_edited: Date.now

      })
        .then((data) => functions.success(res, "variableTinhluong edited successfully", data))
        .catch((err) => functions.setError(res, err.message));
    }
  }
}




//Xóa Một biến tính lương
exports.DeleteVarTinhLuong = async (req, res) => {
  const _id = req.params.id;

  if (isNaN(_id)) {
    functions.setError(res, "Id must be a number");
  } else {
    const variableTinhluong = await functions.getDatafindOne(DefinationVariableTinhluong, { _id: _id });
    if (!variableTinhluong) {
      functions.setError(res, "Invation does not exist");
    } else {
      await functions.getDataDeleteOne(DefinationVariableTinhluong, { _id: _id })
        .then(() => functions.success(res, "Delete invitation successfully", variableTinhluong))
        .catch((err) => functions.setError(res, err.message));
    }
  }
}



//insert một cột mới
exports.InsertVarTinhluong = async (req, res) => {
  try {
    let maxId = await functions.getMaxID(DefinationVariableTinhluong);
    if (!maxId) {
      maxId = 0;
    }
    const _id = Number(maxId) + 1;
    const insert = new DefinationVariableTinhluong({
      _id: _id,
      com_id: req.body.com_id,
      name_var: '',
      note_var: ''
    });

    await insert.save();
    functions.success(res, "insert success", { insert })
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi thêm mới bản ghi' });
  }
};