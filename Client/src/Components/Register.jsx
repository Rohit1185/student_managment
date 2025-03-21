import { useState, useEffect } from "react";
import "../assets/register.css";
import { NavLink } from "react-router";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        additional_info: { enrollment_number: "", employee_id: "", courses: [] },
    });
    const [errors, setErrors] = useState({});
    const [courseInput, setCourseInput] = useState("");

    const validate = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
        if (formData.additional_info.courses.length === 0) newErrors.courses = "Enter at least one course";

        if (formData.role === "student") {
            if (!formData.additional_info.enrollment_number.trim()) newErrors.enrollment_number = "Enrollment Number is required";
        } else {
            if (!formData.additional_info.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        validate();
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdditionalChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, additional_info: { ...formData.additional_info, [name]: value } });
    };

    const handleCourseChange = (e) => {
        setCourseInput(e.target.value);
    };

    const addCourse = () => {
        if (courseInput.trim() && !formData.additional_info.courses.includes(courseInput.trim())) {
            setFormData({
                ...formData,
                additional_info: {
                    ...formData.additional_info,
                    courses: [...formData.additional_info.courses, courseInput.trim()],
                },
            });
            setCourseInput("");
        }
    };

    const removeCourse = (course) => {
        setFormData({
            ...formData,
            additional_info: {
                ...formData.additional_info,
                courses: formData.additional_info.courses.filter((c) => c !== course),
            },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const response = await fetch("http://localhost:8080/student-faculty/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        alert(data.message);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h1>Register</h1>

            <input type="text" name="name" placeholder="Name" onChange={handleChange} className="form-input" required />
            {errors.name && <span className="error">{errors.name}</span>}

            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="form-input" required />
            {errors.email && <span className="error">{errors.email}</span>}

            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-input" required />
            {errors.password && <span className="error">{errors.password}</span>}

            <select name="role" onChange={handleChange} className="form-select">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
            </select>

            {formData.role === "student" ? (
                <>
                    <input type="text" name="enrollment_number" placeholder="Enrollment Number" onChange={handleAdditionalChange} className="form-input" required />
                    {errors.enrollment_number && <span className="error">{errors.enrollment_number}</span>}
                </>
            ) : (
                <>
                    <input type="text" name="employee_id" placeholder="Employee ID" onChange={handleAdditionalChange} className="form-input" required />
                    {errors.employee_id && <span className="error">{errors.employee_id}</span>}
                </>
            )}

            <label className="form-label">Enter Courses:</label>
            <div className="course-input">
                <input
                    type="text"
                    placeholder="Enter course (e.g., Java, Python)"
                    value={courseInput}
                    onChange={handleCourseChange}
                    className="form-input"
                />
                <button type="button" onClick={addCourse} className="add-course-button">Add</button>
            </div>
            {errors.courses && <span className="error">{errors.courses}</span>}

            <div className="course-list">
                {formData.additional_info.courses.map((course, index) => (
                    <div key={index} className="course-item">
                        {course}
                        <button type="button" onClick={() => removeCourse(course)} className="remove-course-button-rohit">✖</button>
                    </div>
                ))}
            </div>

            <button type="submit" className="form-button">Register</button>
            <p>Already have account <NavLink to='/login'  className="auth-link">login here</NavLink></p>
        </form>
    );
};

export default Register;
