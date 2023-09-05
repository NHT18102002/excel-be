const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SampleDefinationVarTinhluongSchema = new Schema({

    _id: {
        type: Number,
        require: true
    },
    name_var:{
        type: String,
        require: true
    },
    note_var:{
        type: String,
        require: true   
    }
    // name: {
    //     type: String,
    //     require: true
    // },
    // chuc_vu: {
    //     type: String,
    //     require: true,
    // },
    // phong_ban: {
    //     type: String,
    //     require: true
    // },
    // luong_co_ban: {
    //     type: Number
    // },
    // phan_tram_hop_dong: {
    //     type: Number
    // },
    // ngay_cong_chuan: {
    //     Type: Number
    // },
    // cong_theo_ca: {
    //     Type: Number,
    // },
    // cong_theo_gio: {
    //     Type: Number
    // },
    // cong_tang_ca: {
    //     Type: Number
    // },
    // ngay_cong_thuc_te: {
    //     Type: Number,
    //     require: true
    // },
    // phu_cap_trach_nhiem: {
    //     Type: Number
    // },
    // phu_cap_an_trua: {
    //     Type: Number
    // },
    // phu_cap_dien_thoai: {
    //     Type: Number
    // },
    // phu_cap_khac: {
    //     Type: Number
    // },
    // thuong: {
    //     Type: Number
    // },

    // phat: {
    //     Type: Number
    // },
    // hoa_hong: {
    //     Type: hoahong
    // },
    // thu_thap_danh_nghia: {
    //     Type: Number
    // },
    // luong_dong_bao_hiem: {
    //     Type: Number
    // },
    // chi_phi_doanh_nghiep: {
    //     Type: chiphidoanhnghiep
    // },

    // khoan_tich_tru_vao_luong: {
    //     Type: khoantichtruvaoluong
    // },
    // giam_tru_gia_canh: {
    //     Type: Number
    // },
    // giam_tru_ban_than: {
    //     Type: Number
    // },
    // thue_tncn: {
    //     Type: Number
    // },
    // tam_ung: {
    //     Type: Number
    // },
    // thuc_linh: {
    //     Type: Number
    // },
    // tien_khac: {
    //     Type: Number
    // },
    // ghi_chu: {
    //     Type: String
    // },
    // tong_luong_thuc_te: {
    //     Type: Number,
    //     require: true
    // },

});

module.exports = mongoose.model('SampleDefinationVarTinhluong', SampleDefinationVarTinhluongSchema);
