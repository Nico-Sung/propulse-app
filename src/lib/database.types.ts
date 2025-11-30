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
            user_preferences: {
                Row: {
                    user_id: string;
                    theme: "light" | "dark";
                    view_mode: "normal" | "compact";
                    kanban_sort:
                        | "date_desc"
                        | "date_asc"
                        | "name_asc"
                        | "manual";
                    show_history: boolean;
                    show_follow_ups?: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    theme?: "light" | "dark";
                    view_mode?: "normal" | "compact";
                    kanban_sort?:
                        | "date_desc"
                        | "date_asc"
                        | "name_asc"
                        | "manual";
                    show_history?: boolean;
                    show_follow_ups?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    user_id?: string;
                    theme?: "light" | "dark";
                    view_mode?: "normal" | "compact";
                    kanban_sort?:
                        | "date_desc"
                        | "date_asc"
                        | "name_asc"
                        | "manual";
                    show_history?: boolean;
                    show_follow_ups?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_preferences_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tags: {
                Row: {
                    id: string;
                    user_id: string;
                    label: string;
                    color: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    label: string;
                    color: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    label?: string;
                    color?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
            application_tags: {
                Row: {
                    application_id: string;
                    tag_id: string;
                };
                Insert: {
                    application_id: string;
                    tag_id: string;
                };
                Update: {
                    application_id?: string;
                    tag_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "application_tags_application_id_fkey";
                        columns: ["application_id"];
                        referencedRelation: "applications";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "application_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        referencedRelation: "tags";
                        referencedColumns: ["id"];
                    }
                ];
            };
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
                Relationships: [];
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
                    position: number;
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
                    position?: number;
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
                    position?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "applications_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "documents_application_id_fkey";
                        columns: ["application_id"];
                        referencedRelation: "applications";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [];
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
                Relationships: [];
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
                Relationships: [];
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
                Relationships: [];
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
                Relationships: [];
            };
        };
    };
}
