# ==============================================
# ฟีเจอร์เพิ่ม: อัปโหลดไฟล์ + ลบส่วนขยาย
# ==============================================
from fastapi import UploadFile, File, Form

class UploadInstallRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    version: str = "latest"
    expected_hash: Optional[str] = None

@app.post("/upload/extension", summary="อัปโหลดไฟล์ zip แล้วติดตั้งทันที")
async def upload_extension(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(""),
    version: str = Form("latest"),
    expected_hash: Optional[str] = Form(None),
    access: Dict = Depends(verify_access)
):
    ext_id = f"ext_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"
    temp_file = f"{DOWNLOAD_DIR}/{ext_id}.zip"
    install_path = f"{INSTALLED_DIR}/{ext_id}"

    try:
        # เซฟไฟล์ที่อัปโหลด
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:
            raise HTTPException(400, detail="ไฟล์ใหญ่เกิน 50MB")
        with open(temp_file, "wb") as f:
            f.write(content)

        file_hash = calculate_file_hash(temp_file)

        # ตรวจแฮช
        if expected_hash and file_hash!= expected_hash:
            shutil.move(temp_file, f"{QUARANTINE_DIR}/{ext_id}.zip")
            raise HTTPException(400, detail=f"แฮชไม่ตรง ไฟล์ถูกกักกัน")

        # สแกนความปลอดภัย
        security = scan_code_security(temp_file)
        if not security["safe"]:
            shutil.move(temp_file, f"{QUARANTINE_DIR}/{ext_id}.zip")
            raise HTTPException(400, detail=f"เสี่ยงระดับ {security['risk_level']}: {security['issues']}")

        # ติดตั้ง
        os.makedirs(install_path, exist_ok=True)
        if not extract_package(temp_file, install_path):
            raise HTTPException(500, detail="แตกไฟล์ไม่ได้")

        # บันทึก
        extension_info = {
            "id": ext_id,
            "name": name,
            "description": description,
            "version": version,
            "install_date": datetime.now().isoformat(),
            "source_url": "uploaded",
            "file_hash": file_hash,
            "security_score": security["score"],
            "risk_level": security["risk_level"],
            "installed_by_ip": access["ip"]
        }
        INSTALLED_EXTENSIONS[ext_id] = extension_info
        os.remove(temp_file)

        return {
            "status": "success",
            "message": "อัปโหลดและติดตั้งสำเร็จ",
            "extension": extension_info
        }
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        if os.path.exists(install_path):
            shutil.rmtree(install_path)
        raise HTTPException(400, detail=str(e))

@app.delete("/extensions/{ext_id}", summary="ลบส่วนขยาย")
async def delete_extension(ext_id: str, access: Dict = Depends(verify_access)):
    if ext_id not in INSTALLED_EXTENSIONS:
        raise HTTPException(404, detail="ไม่พบส่วนขยายนี้")

    install_path = f"{INSTALLED_DIR}/{ext_id}"
    ext_info = INSTALLED_EXTENSIONS[ext_id]

    try:
        # ย้ายไป backup ก่อนลบ เผื่อป๋าจะกู้
        backup_path = f"{BACKUP_DIR}/{ext_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        if os.path.exists(install_path):
            shutil.move(install_path, backup_path)

        # ลบออกจากระบบ
        del INSTALLED_EXTENSIONS[ext_id]

        return {
            "status": "success",
            "message": f"ลบ {ext_info['name']} สำเร็จ ย้ายไป backup แล้ว",
            "backup_path": backup_path
        }
    except Exception as e:
        raise HTTPException(500, detail=f"ลบไม่สำเร็จ: {str(e)}")
