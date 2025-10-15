export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            applications: {
                Row: {
                    id: string;
                    user_id: string;
                    company_name: string;
                    position_title: string;
                    job_description: string;
                    status:
                        | "to_apply"
                        | "applied"
                        | "waiting"
                        | "interview"
                        | "offer"
                        | "rejected";
                    application_date: string | null;
                    last_contact_date: string | null;
                    notes: string;
                    job_url: string;
                    contract_type: string;
                    deadline: string | null;
                    interview_date: string | null;
                    salary_range: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    company_name: string;
                    position_title: string;
                    job_description?: string;
                    status?:
                        | "to_apply"
                        | "applied"
                        | "waiting"
                        | "interview"
                        | "offer"
                        | "rejected";
                    application_date?: string | null;
                    last_contact_date?: string | null;
                    notes?: string;
                    job_url?: string;
                    contract_type?: string;
                    deadline?: string | null;
                    interview_date?: string | null;
                    salary_range?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    company_name?: string;
                    position_title?: string;
                    job_description?: string;
                    status?:
                        | "to_apply"
                        | "applied"
                        | "waiting"
                        | "interview"
                        | "offer"
                        | "rejected";
                    application_date?: string | null;
                    last_contact_date?: string | null;
                    notes?: string;
                    job_url?: string;
                    contract_type?: string;
                    deadline?: string | null;
                    interview_date?: string | null;
                    salary_range?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            documents: {
                Row: {
                    id: string;
                    user_id: string;
                    application_id: string | null;
                    document_type: "cv" | "cover_letter";
                    file_name: string;
                    file_url: string;
                    version_number: number;
                    keywords_found: string[];
                    keywords_missing: string[];
                    match_percentage: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    application_id?: string | null;
                    document_type: "cv" | "cover_letter";
                    file_name: string;
                    file_url: string;
                    version_number?: number;
                    keywords_found?: string[];
                    keywords_missing?: string[];
                    match_percentage?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    application_id?: string | null;
                    document_type?: "cv" | "cover_letter";
                    file_name?: string;
                    file_url?: string;
                    version_number?: number;
                    keywords_found?: string[];
                    keywords_missing?: string[];
                    match_percentage?: number;
                    created_at?: string;
                };
            };
            reminders: {
                Row: {
                    id: string;
                    application_id: string;
                    reminder_type: "follow_up" | "inactive" | "interview_prep";
                    reminder_date: string;
                    is_dismissed: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    application_id: string;
                    reminder_type: "follow_up" | "inactive" | "interview_prep";
                    reminder_date: string;
                    is_dismissed?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    application_id?: string;
                    reminder_type?: "follow_up" | "inactive" | "interview_prep";
                    reminder_date?: string;
                    is_dismissed?: boolean;
                    created_at?: string;
                };
            };
            contacts: {
                Row: {
                    id: string;
                    application_id: string;
                    name: string;
                    email: string;
                    linkedin_url: string;
                    phone: string;
                    notes: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    application_id: string;
                    name?: string;
                    email?: string;
                    linkedin_url?: string;
                    phone?: string;
                    notes?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    application_id?: string;
                    name?: string;
                    email?: string;
                    linkedin_url?: string;
                    phone?: string;
                    notes?: string;
                    created_at?: string;
                };
            };
            tasks: {
                Row: {
                    id: string;
                    application_id: string;
                    title: string;
                    is_completed: boolean;
                    order: number;
                    created_at: string;
                    completed_at: string | null;
                };
                Insert: {
                    id?: string;
                    application_id: string;
                    title: string;
                    is_completed?: boolean;
                    order?: number;
                    created_at?: string;
                    completed_at?: string | null;
                };
                Update: {
                    id?: string;
                    application_id?: string;
                    title?: string;
                    is_completed?: boolean;
                    order?: number;
                    created_at?: string;
                    completed_at?: string | null;
                };
            };
            activity_history: {
                Row: {
                    id: string;
                    application_id: string;
                    activity_type:
                        | "status_change"
                        | "note"
                        | "task_completed"
                        | "document_added"
                        | "contact_added"
                        | "interview_scheduled";
                    description: string;
                    metadata: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    application_id: string;
                    activity_type:
                        | "status_change"
                        | "note"
                        | "task_completed"
                        | "document_added"
                        | "contact_added"
                        | "interview_scheduled";
                    description: string;
                    metadata?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    application_id?: string;
                    activity_type?:
                        | "status_change"
                        | "note"
                        | "task_completed"
                        | "document_added"
                        | "contact_added"
                        | "interview_scheduled";
                    description?: string;
                    metadata?: Json;
                    created_at?: string;
                };
            };
            victory_reports: {
                Row: {
                    id: string;
                    application_id: string;
                    key_differentiator: string;
                    valued_skills: string;
                    advice_to_past_self: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    application_id: string;
                    key_differentiator?: string;
                    valued_skills?: string;
                    advice_to_past_self?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    application_id?: string;
                    key_differentiator?: string;
                    valued_skills?: string;
                    advice_to_past_self?: string;
                    created_at?: string;
                };
            };
        };
    };
}
