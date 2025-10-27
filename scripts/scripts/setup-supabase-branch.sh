#!/bin/bash

# Coach AI - Supabase Branching Setup Script
# This script helps set up Supabase branches for preview environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first:"
        echo "  brew install supabase/tap/supabase"
        exit 1
    fi
    print_success "Supabase CLI is installed"
}

# Check if user is logged in
check_auth() {
    if ! supabase projects list &> /dev/null; then
        print_error "Not logged in to Supabase. Please run:"
        echo "  supabase login"
        exit 1
    fi
    print_success "Logged in to Supabase"
}

# List available projects
list_projects() {
    print_status "Available Supabase projects:"
    supabase projects list
}

# Create a new branch
create_branch() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        print_error "Branch name is required"
        echo "Usage: $0 create <branch-name>"
        exit 1
    fi
    
    print_status "Creating branch: $branch_name"
    
    # Create the branch
    if supabase branches create "$branch_name"; then
        print_success "Branch '$branch_name' created successfully"
        
        # Get branch details
        print_status "Branch details:"
        supabase branches list | grep "$branch_name"
        
        # Show next steps
        echo ""
        print_status "Next steps:"
        echo "1. Update your Vercel environment variables with the branch URL"
        echo "2. Deploy your preview environment"
        echo "3. Test the branch-specific functionality"
        echo ""
        echo "To delete this branch later:"
        echo "  supabase branches delete $branch_name"
        
    else
        print_error "Failed to create branch '$branch_name'"
        exit 1
    fi
}

# List existing branches
list_branches() {
    print_status "Existing Supabase branches:"
    supabase branches list
}

# Delete a branch
delete_branch() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        print_error "Branch name is required"
        echo "Usage: $0 delete <branch-name>"
        exit 1
    fi
    
    print_warning "Are you sure you want to delete branch '$branch_name'? (y/N)"
    read -r confirmation
    
    if [[ $confirmation =~ ^[Yy]$ ]]; then
        print_status "Deleting branch: $branch_name"
        if supabase branches delete "$branch_name"; then
            print_success "Branch '$branch_name' deleted successfully"
        else
            print_error "Failed to delete branch '$branch_name'"
            exit 1
        fi
    else
        print_status "Branch deletion cancelled"
    fi
}

# Show help
show_help() {
    echo "Coach AI - Supabase Branching Setup Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list                    List all Supabase projects"
    echo "  branches               List all branches"
    echo "  create <branch-name>   Create a new branch"
    echo "  delete <branch-name>   Delete a branch"
    echo "  help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 branches"
    echo "  $0 create feat/new-feature"
    echo "  $0 delete feat/old-feature"
}

# Main script logic
main() {
    local command=$1
    local branch_name=$2
    
    # Check prerequisites
    check_supabase_cli
    check_auth
    
    case $command in
        "list")
            list_projects
            ;;
        "branches")
            list_branches
            ;;
        "create")
            create_branch "$branch_name"
            ;;
        "delete")
            delete_branch "$branch_name"
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
