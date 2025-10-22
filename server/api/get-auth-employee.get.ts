export default defineEventHandler(async (event) => {
    try {
        // هذا يعتمد على نظام المصادقة الذي تستخدمه
        const user = await requireUserSession(event);
        
        // تحقق إذا كان المستخدم موظف
        if (user.type !== 'employee') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden - Employee access only'
            });
        }
        
        // جلب بيانات الموظف من قاعدة البيانات
        const employee = await getEmployeeById(user.id);
        
        return {
            status: 'success',
            data: employee
        };
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }
});