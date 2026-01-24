import React, { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    dateOfCamp: "",
    targetGroup: "",
    wardNo: "",
    habitation: "",
    projectResponsible: "",
    medicineType: "",
    specialisation: "",
    organiser: "",
    doctors: "",
    gda: "",
    beneficiaries: "",
    findings: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted ✅", formData);
    alert("Form submitted!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-card border border-border shadow-elevated rounded-xl p-10">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Camp Report Form</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-foreground">Date of Camp</label>
              <input type="date" name="dateOfCamp" value={formData.dateOfCamp} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label className="block font-medium mb-2 text-foreground">Target Group</label>
              <select name="targetGroup" value={formData.targetGroup} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary">
                <option value="">-- Select --</option>
                <option>Children</option>
                <option>Women</option>
                <option>Elderly</option>
                <option>General</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-foreground">Ward No</label>
              <input type="number" name="wardNo" value={formData.wardNo} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label className="block font-medium mb-2 text-foreground">Habitation</label>
              <input type="text" name="habitation" value={formData.habitation} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-foreground">Project Responsible</label>
              <input type="text" name="projectResponsible" value={formData.projectResponsible} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label className="block font-medium mb-2 text-foreground">Organiser</label>
              <input type="text" name="organiser" value={formData.organiser} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-foreground">Specialisation</label>
              <input type="text" name="specialisation" value={formData.specialisation} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label className="block font-medium mb-2 text-foreground">Medicine Type</label>
              <select name="medicineType" value={formData.medicineType} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary">
                <option value="">-- Select --</option>
                <option>Allopathy</option>
                <option>Homeopathy</option>
                <option>Ayurveda</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-foreground">No. of Doctors</label>
              <input type="number" name="doctors" value={formData.doctors} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
            <div>
              <label className="block font-medium mb-2 text-foreground">No. of GDA</label>
              <input type="number" name="gda" value={formData.gda} onChange={handleChange}
                className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
            </div>
          </div>

          {/* Row 6 */}
          <div>
            <label className="block font-medium mb-2 text-foreground">Total Beneficiaries</label>
            <input type="number" name="beneficiaries" value={formData.beneficiaries} onChange={handleChange}
              className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 focus:ring-primary focus:border-primary"/>
          </div>

          {/* Findings */}
          <div>
            <label className="block font-medium mb-2 text-foreground">Major Findings</label>
            <textarea name="findings" rows="4" value={formData.findings} onChange={handleChange}
              className="w-full border border-input bg-input text-foreground rounded-md px-4 py-3 min-h-[120px] focus:ring-primary focus:border-primary"/>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-4 rounded-full transition">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
