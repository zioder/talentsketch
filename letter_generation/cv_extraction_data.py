import os
import re
import streamlit as st
from pdfminer.high_level import extract_text
from docx import Document
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage

def initialize_llm():
    return ChatGroq(
        temperature=0.7,
        groq_api_key="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",
        model_name="llama3-8b-8192"
    )

llm = initialize_llm()

def clean_text(text):
    """Removes extra spaces and unnecessary characters."""
    text = re.sub(r'\s+', ' ', text)  
    text = re.sub(r'[^a-zA-Z0-9éèàùôç.,;:!?\'"\-\(\)\s]', '', text)  
    return text.strip()

st.set_page_config(page_title="CV to Cover Letter Generator", layout="centered")
st.title("📄 CV to Cover Letter Generator")
st.write("Upload your CV (PDF) and get a professional cover letter instantly!")

uploaded_file = st.file_uploader("Upload your CV (PDF)", type=["pdf"])

if uploaded_file:
    file_path = f"./{uploaded_file.name}"
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    try:
        text = extract_text(file_path)
        text = clean_text(text)
        st.success("CV text extracted successfully!")
    except Exception as e:
        st.error(f"Error extracting text: {e}")
        st.stop()

    st.subheader("Please provide additional details:")

    post = st.text_input("Enter the Post you're applying for:")
    company_name = st.text_input("Enter the Company Name:")

    if post and company_name:
        prompt = f"""
        You are a professional assistant specializing in writing **high-quality cover letters**.

        **Task**:
        Read the following **CV text** and generate a professional, well-structured, and impactful **cover letter** based on the information.

        ---

        **CV Text (Raw Data)**:
        {text}

        ---

         **Cover Letter Structure**:
        1️**Introduction**  
        - Present the candidate.  
        - Explain why they are applying.  

        2️**Main Body**  
        - Highlight skills and experience relevant to the job.  

        3️ **Conclusion**  
        - Express gratitude.  
        - Invite for an interview.  

         **IMPORTANT**:
        - Write in a **formal, engaging, and professional tone**.  
        - Ensure the letter is **structured, coherent, and compelling**.  
        - **Use only the information from the CV** (do not add extra details).  

        ---

        Additional Details:
        - **Post**: {post}
        - **Company Name**: {company_name}

        Now, generate the cover letter.
        """

        with st.spinner("Generating your cover letter..."):
            try:
                response = llm.invoke([
                    SystemMessage(content="You are an expert in writing professional cover letters."),
                    HumanMessage(content=prompt)
                ])
                motivation_letter = response.content
                st.success(" Cover Letter Generated Successfully!")
            except Exception as e:
                st.error(f"Error generating the letter: {e}")
                st.stop()

        st.subheader("📜 Generated Cover Letter:")
        st.write(motivation_letter)

        doc_path = "./Generated_Cover_Letter.docx"
        doc = Document()
        doc.add_paragraph(motivation_letter)
        doc.save(doc_path)

        with open(doc_path, "rb") as f:
            st.download_button(
                label="📥 Download Cover Letter (Word)",
                data=f,
                file_name="Cover_Letter.docx",
                mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )

        os.remove(file_path)
        os.remove(doc_path)
